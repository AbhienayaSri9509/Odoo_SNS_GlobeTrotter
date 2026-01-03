import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// --- LocalStorage Mock DB Helper ---
const MockDB = {
    get: (table) => {
        try {
            const data = localStorage.getItem(`supamock_${table}`);
            return data ? JSON.parse(data) : [];
        } catch { return []; }
    },
    set: (table, data) => {
        localStorage.setItem(`supamock_${table}`, JSON.stringify(data));
    },
    insert: (table, records) => {
        const current = MockDB.get(table);
        // Add ID if missing
        const newRecords = records.map(r => ({
            ...r,
            id: r.id || `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            created_at: new Date().toISOString()
        }));
        MockDB.set(table, [...current, ...newRecords]);
        return newRecords;
    },
    update: (table, updates, matchCol, matchVal) => {
        const current = MockDB.get(table);
        const updated = current.map(row =>
            row[matchCol] === matchVal ? { ...row, ...updates } : row
        );
        MockDB.set(table, updated);
        return updated.filter(row => row[matchCol] === matchVal);
    },
    delete: (table, matchCol, matchVal) => {
        const current = MockDB.get(table);
        const filtered = current.filter(row => row[matchCol] !== matchVal);
        MockDB.set(table, filtered);
        return current.filter(row => row[matchCol] === matchVal); // Returns deleted?
    }
};

// --- Mock Client ---
const createMockClient = () => {
    let session = getStoredSession();
    const listeners = [];

    function getStoredSession() {
        try {
            return JSON.parse(localStorage.getItem('supamock_session'));
        } catch { return null; }
    }

    function setStoredSession(sess) {
        if (sess) localStorage.setItem('supamock_session', JSON.stringify(sess));
        else localStorage.removeItem('supamock_session');
        session = sess;
    }

    const notifyListeners = (event, session) => {
        listeners.forEach(callback => callback(event, session));
    };

    return {
        auth: {
            getUser: async () => ({ data: { user: session?.user || null }, error: null }),
            getSession: async () => ({ data: { session }, error: null }),
            onAuthStateChange: (callback) => {
                listeners.push(callback);
                // Fire immediate initial state
                setTimeout(() => callback(session ? 'SIGNED_IN' : 'SIGNED_OUT', session), 0);
                return { data: { subscription: { unsubscribe: () => { } } } };
            },
            signInWithPassword: async ({ email }) => {
                const user = {
                    id: 'mock_user_123',
                    email,
                    user_metadata: { full_name: email.split('@')[0], avatar_url: `https://ui-avatars.com/api/?name=${email}` }
                };
                const newSession = { access_token: 'mock_token', user };
                setStoredSession(newSession);
                notifyListeners('SIGNED_IN', newSession);
                return { data: { session: newSession, user }, error: null };
            },
            signUp: async ({ email, options }) => {
                const user = {
                    id: 'mock_user_123',
                    email,
                    user_metadata: { ...options?.data }
                };
                const newSession = { access_token: 'mock_token', user };
                setStoredSession(newSession);
                notifyListeners('SIGNED_IN', newSession);
                return { data: { session: newSession, user }, error: null };
            },
            signOut: async () => {
                setStoredSession(null);
                notifyListeners('SIGNED_OUT', null);
                return { error: null };
            },
        },
        storage: {
            from: (bucket) => ({
                upload: async (path, file) => {
                    // Mock upload - just return a fake path
                    console.log(`[Mock Storage] Uploaded ${path}`);
                    return { data: { path }, error: null };
                },
                getPublicUrl: (path) => {
                    // Return a placeholder or blob URL if we could (hard to do blob across reloads without indexeddb)
                    // For now, return a generic placeholder or the path if it's external
                    return { data: { publicUrl: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=800' } };
                }
            })
        },
        from: (table) => {
            let queryOps = {
                type: 'select', // select, insert, update, delete
                filters: [], // { col, op, val }
                orders: [],
                limit: null,
                single: false,
                data: null, // for insert/update
                columns: '*'
            };

            const chain = {
                select: (columns = '*') => {
                    queryOps.type = 'select';
                    queryOps.columns = columns;
                    return chain;
                },
                insert: (data) => {
                    queryOps.type = 'insert';
                    queryOps.data = Array.isArray(data) ? data : [data];
                    return chain;
                },
                update: (data) => {
                    queryOps.type = 'update';
                    queryOps.data = data;
                    return chain;
                },
                delete: () => {
                    queryOps.type = 'delete';
                    return chain;
                },
                eq: (col, val) => {
                    queryOps.filters.push({ col, op: 'eq', val });
                    return chain;
                },
                order: (col, { ascending = true } = {}) => {
                    queryOps.orders.push({ col, ascending });
                    return chain;
                },
                limit: (n) => {
                    queryOps.limit = n;
                    return chain;
                },
                single: () => {
                    queryOps.single = true;
                    return chain.then(res => {
                        // single() expects 1 row, if 0 rows in real supabase it throws error often, 
                        // but here let's just return data: row or data: null
                        if (res.data && res.data.length > 0) return { data: res.data[0], error: null };
                        return { data: null, error: { code: 'PGRST116', message: 'row not found' } };
                    });
                },
                then: (resolve, reject) => {
                    // Execute Query
                    setTimeout(() => {
                        try {
                            let result = [];
                            let error = null;

                            if (queryOps.type === 'insert') {
                                result = MockDB.insert(table, queryOps.data);
                            } else if (queryOps.type === 'select') {
                                let rows = MockDB.get(table);
                                // Filter
                                rows = rows.filter(row => {
                                    return queryOps.filters.every(f => {
                                        if (f.op === 'eq') return row[f.col] == f.val; // loose equality for string/num
                                        return true;
                                    });
                                });
                                // Sort
                                queryOps.orders.forEach(({ col, ascending }) => {
                                    rows.sort((a, b) => {
                                        if (a[col] < b[col]) return ascending ? -1 : 1;
                                        if (a[col] > b[col]) return ascending ? 1 : -1;
                                        return 0;
                                    });
                                });
                                result = rows;
                            } else if (queryOps.type === 'update') {
                                // Simplified: only supports update by EQ filter (usually id)
                                const idFilter = queryOps.filters.find(f => f.op === 'eq' && f.col === 'id');
                                if (idFilter) {
                                    result = MockDB.update(table, queryOps.data, 'id', idFilter.val);
                                } else {
                                    // Fallback: update all matches? Danger in mock. 
                                    // Let's assume ID based update mostly.
                                }
                            } else if (queryOps.type === 'delete') {
                                const idFilter = queryOps.filters.find(f => f.op === 'eq' && f.col === 'id');
                                if (idFilter) {
                                    MockDB.delete(table, 'id', idFilter.val);
                                }
                                result = null;
                            }

                            if (queryOps.limit && Array.isArray(result)) {
                                result = result.slice(0, queryOps.limit);
                            }

                            resolve({ data: result, error });
                        } catch (e) {
                            reject(e);
                        }
                    }, 50); // Small delay to simulate async
                }
            };
            return chain;
        }
    };
};

export const supabase = (supabaseUrl && supabaseUrl !== 'https://placeholder-url.supabase.co' && supabaseAnonKey)
    ? createClient(supabaseUrl, supabaseAnonKey)
    : createMockClient();
