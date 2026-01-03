export const MOCK_ACTIVITIES = [
    {
        id: '1',
        title: 'Arrival & Check-in',
        date: '2024-06-15',
        start_time: '10:00',
        end_time: '11:00',
        cost: 0,
        city_name: 'Paris',
        description: 'Check in at Hotel Le Meurice'
    },
    {
        id: '2',
        title: 'Visit Eiffel Tower',
        date: '2024-06-15',
        start_time: '14:00',
        end_time: '17:00',
        cost: 35,
        city_name: 'Paris',
        description: 'Summit access and guided tour'
    },
    {
        id: '3',
        title: 'Dinner at Le Jules Verne',
        date: '2024-06-15',
        start_time: '19:00',
        end_time: '21:00',
        cost: 150,
        city_name: 'Paris',
        description: 'Reservation confirmed'
    },
    {
        id: '4',
        title: 'Louvre Museum',
        date: '2024-06-16',
        start_time: '09:00',
        end_time: '13:00',
        cost: 22,
        city_name: 'Paris',
        description: 'Skip-the-line tickets'
    },
    {
        id: '5',
        title: 'Train to Nice',
        date: '2024-06-17',
        start_time: '08:00',
        end_time: '13:00',
        cost: 85,
        city_name: 'Nice',
        description: 'TGV Inoui'
    }
];

export const MOCK_TRIP = {
    id: 'trip_1',
    name: 'Summer in France',
    start_date: '2024-06-15',
    end_date: '2024-06-25',
    cities: ['Paris', 'Nice', 'Lyon']
};
