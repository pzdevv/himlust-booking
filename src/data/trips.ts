export interface Trip {
    id: string;
    title: string;
    images: string[];
    days: number;
    location: string;
    price: number;
    childPrice: number;
    difficulty: "Easy" | "Moderate" | "Challenging";
    isLastMinute: boolean;
    overview: string;
    highlights: string[];
    maxAltitude: string;
    bestSeason: string;
    startPoint: string;
    endPoint: string;
    minPax: number;
    maxPax: number;
    itinerary: {
        day: number;
        title: string;
        description: string;
    }[];
    included: string[];
    excluded: string[];
    pdf_path?: string;
}

export const trips: Trip[] = [
    {
        id: "everest-base-camp",
        title: "Everest Base Camp Trek",
        images: [
            "https://lh3.googleusercontent.com/aida-public/AB6AXuCfJEEGO8QeGOwLPniRnEbX2Xw3sRRqQmfcSMbA47fl_8HkYlnKYPimfFSvsx-yzDSoav0_XiOX7MiCq7v420HI5SMXM_o1pSJMYuBkTuBDj3rq4BaZd7C5_cwjVmNUCErzCzR1EykkwHKP-zaVZrBKk7EQ5VL_iOCprYvLloTTFXz9p9JcRjqSq9OvTgX1H4jjqzShHcyvqCsEEOXR0NzUUpVzNGjLsV25qbyMbc2JboK9kugEVMmN-vUf2jUHvLqcbSTyOP52sVw",
            "https://lh3.googleusercontent.com/aida-public/AB6AXuDqLl5dJEmFKukOTHD0jrqL2omBE8meUC02bU_kB3vKNIQk3UU5ua9P17HYyk-a7HwuQhAmN00OyjY2luvsUGootfUV6dPSCNWdNizkofpbrw24-UtM89H2gdCOAyjPuJ7je82ErCcFA4NlPRG_MuCgZQGZ1x_wvIfoHhkt1Z-k6OJ3QlULTs6Tz87wC9_3r0cIdH3m7DFvrkZ3EDdNdWcXylTf_AYSHzyadpIPLfA9tVS9UXDoChqepXxRswpTkx_jsH4LMawqSrU",
        ],
        days: 12,
        location: "Nepal",
        price: 1299,
        childPrice: 899,
        difficulty: "Moderate",
        isLastMinute: false,
        overview:
            "Experience the ultimate Himalayan adventure. Trek to the base of the world's highest mountain, passing through Sherpa villages, ancient monasteries, and breathtaking alpine landscapes.",
        highlights: [
            "Stand at the base of Mt. Everest (8,848m)",
            "Explore Namche Bazaar and Tengboche Monastery",
            "Spectacular views of Ama Dablam, Lhotse, and Nuptse",
            "Immerse in Sherpa culture",
        ],
        maxAltitude: "5,545m (Kala Patthar)",
        bestSeason: "Mar-May, Sep-Nov",
        startPoint: "Kathmandu",
        endPoint: "Kathmandu",
        minPax: 2,
        maxPax: 12,
        itinerary: [
            {
                day: 1,
                title: "Arrival in Kathmandu",
                description:
                    "Welcome to Nepal! Transfer to your hotel and meet your guide for a briefing.",
            },
            {
                day: 2,
                title: "Fly to Lukla, Trek to Phakding",
                description:
                    "Scenic flight to Lukla (2,840m). Begin trekking through the Dudh Koshi valley to Phakding.",
            },
            {
                day: 3,
                title: "Trek to Namche Bazaar",
                description:
                    "Ascend through pine forests and cross suspension bridges to reach the vibrant Sherpa capital.",
            },
            // ... more days would be here
        ],
        included: [
            "Airport transfers",
            "Domestic flights to/from Lukla",
            "Teahouse accommodation during trek",
            "All meals during trek",
            "Certified guide and porters",
        ],
        excluded: [
            "International flights",
            "Travel insurance",
            "Personal equipment",
            "Tips for staff",
        ],
    },
    // Add more minimal data for other trips to avoid typescript errors in list view
    {
        id: "patagonia-expedition",
        title: "Patagonia Expedition",
        images: [
            "https://lh3.googleusercontent.com/aida-public/AB6AXuDqLl5dJEmFKukOTHD0jrqL2omBE8meUC02bU_kB3vKNIQk3UU5ua9P17HYyk-a7HwuQhAmN00OyjY2luvsUGootfUV6dPSCNWdNizkofpbrw24-UtM89H2gdCOAyjPuJ7je82ErCcFA4NlPRG_MuCgZQGZ1x_wvIfoHhkt1Z-k6OJ3QlULTs6Tz87wC9_3r0cIdH3m7DFvrkZ3EDdNdWcXylTf_AYSHzyadpIPLfA9tVS9UXDoChqepXxRswpTkx_jsH4LMawqSrU",
        ],
        days: 18,
        location: "Argentina",
        price: 2450,
        childPrice: 1800,
        difficulty: "Challenging",
        isLastMinute: false,
        overview: "Wild wilderness trekking in Patagonia.",
        highlights: ["Fitz Roy", "Perito Moreno Glacier"],
        maxAltitude: "1,200m",
        bestSeason: "Nov-Mar",
        startPoint: "El Calafate",
        endPoint: "Ushuaia",
        minPax: 4,
        maxPax: 10,
        itinerary: [],
        included: [],
        excluded: [],
    },
    {
        id: "sapa-valley-walk",
        title: "Sapa Valley Walk",
        images: [
            "https://lh3.googleusercontent.com/aida-public/AB6AXuDsja5REWyVegDxk5EiaQ98lcNYUwuSbYnvXmaHoWMP5llnAgnyEgkP2WGgT2HMkyB_fBFSjy90p-CLy8IgyoLpGtInOqQrgzZ0D59HJ33FBO48aRQLO7uUcFADnD3U_1k9zghuoWRaF8Fyps_92qW-h1lS1ZKxNqlhrl6U6whSROvkkCySBhuBs6LqoHItB1rMMR7trVPTcx8jOdYufgO3y8jahVQzvk0kgVZwCR0noKgoXF-EW9enkVYvB1B_t4yTwvUjulwk_yU",
        ],
        days: 5,
        location: "Vietnam",
        price: 499,
        childPrice: 350,
        difficulty: "Easy",
        isLastMinute: false,
        overview: "Cultural walk through Vietnam's rice terraces.",
        highlights: ["Rice terraces", "Local villages"],
        maxAltitude: "1,600m",
        bestSeason: "Year round",
        startPoint: "Hanoi",
        endPoint: "Hanoi",
        minPax: 1,
        maxPax: 15,
        itinerary: [],
        included: [],
        excluded: [],
    },
    {
        id: "laugavegur-trail",
        title: "Laugavegur Trail",
        images: [
            "https://lh3.googleusercontent.com/aida-public/AB6AXuAd0gSphXuvZ8bdOKIU3yBKtp0SiM00uUto-LKf06dva4yF427-J1o2k0Y_4BWo5aEVOwBSGw-_OV6KFRwZkYOleOH5sWGJv0AOXKkQElODKAtC_9bBmS0PFy-4dMPnUUlTuYhY09jZJ_3J3FN03nwKuvGuKfmQhv48iDVhrDvJ8KDo9ZW8Sgbt_d6bnZfnOO0CMXQ5Aj6k_-8rtCeAxjbzSxCy2WXRJrdr6xxNtehGyOpro1FYuGoNUTzt8UKJui1EmbE4-20t6kA",
        ],
        days: 10,
        location: "Iceland",
        price: 1850,
        childPrice: 1400,
        difficulty: "Moderate",
        isLastMinute: true,
        overview: "Iceland's most famous hiking trail.",
        highlights: ["Geothermal areas", "Rainbow mountains"],
        maxAltitude: "1,100m",
        bestSeason: "Jun-Sep",
        startPoint: "Reykjavik",
        endPoint: "Reykjavik",
        minPax: 2,
        maxPax: 12,
        itinerary: [],
        included: [],
        excluded: [],
    },
    {
        id: "west-highland-way",
        title: "West Highland Way",
        images: [
            "https://lh3.googleusercontent.com/aida-public/AB6AXuBxDZ1iCrV_dt5Fu4TXcQOKff8hRW1i4EV_2R3pak4rtXy6z6Ne4cZCaC-LX0Y1RkVTvc4rF_9panj90OePqSp-klzNcjzsFUJz8_O4ENHzIBqU9ifAYeRQPGZGZsBlOQj9WFX1t3y6x1EhOFWHCKMpNCzPZKLE8DBWqVHvM_Ujt8eySoiacKiTR8V3N_5Ve1_CAOmQGbV-UUFwxkogkPp-XX0GXefkNiJGocdMpL6h3AWFzNm5975NgR0G5dCZSvLsYUcnIP0Q-fU",
        ],
        days: 7,
        location: "Scotland",
        price: 899,
        childPrice: 600,
        difficulty: "Easy",
        isLastMinute: false,
        overview: "Scotland's premier long distance route.",
        highlights: ["Loch Lomond", "Ben Nevis"],
        maxAltitude: "550m",
        bestSeason: "May-Oct",
        startPoint: "Milngavie",
        endPoint: "Fort William",
        minPax: 1,
        maxPax: 20,
        itinerary: [],
        included: [],
        excluded: [],
    },
    {
        id: "huayhuash-circuit",
        title: "Huayhuash Circuit",
        images: [
            "https://lh3.googleusercontent.com/aida-public/AB6AXuB9ffaNB_ZEQtGMGG-3YeVxkRtDD9gvQqsPRQoU8JZDrxnXazWTXPXe-4f7FNY-6QiaqA1v8RMEzdBLvIUEb__Kaz12DjBZ_ZVZSWdefVlamCEhp_e0zmdVZ8QPRo2g40pbVcaMQSNgit1SNra2U_sIi4e1PbDNN6Fh9PfQPOuQPBfoDo8hrg4lY8Z24IoRa8iY_gW1Gb7NYROH4meQuL455kRT9bFNY2sx5rbHDod-k62TMi8hFU-t1SBmhEks4zUDMIqCblhW0cc",
        ],
        days: 14,
        location: "Peru",
        price: 1690,
        childPrice: 1200,
        difficulty: "Challenging",
        isLastMinute: false,
        overview: "One of the most dramatic high altitude treks in the world.",
        highlights: ["Yerupajá", "Alpine lakes"],
        maxAltitude: "5,000m+",
        bestSeason: "May-Sep",
        startPoint: "Huaraz",
        endPoint: "Huaraz",
        minPax: 4,
        maxPax: 8,
        itinerary: [],
        included: [],
        excluded: [],
    },
    {
        id: "tour-du-mont-blanc",
        title: "Tour du Mont Blanc",
        images: [
            "https://lh3.googleusercontent.com/aida-public/AB6AXuCNuZ0dhhhur-z_W3FrGgvZWgJqDyqjQr0VNFD-_uh275NKNsYjOblJX1bd4GacPM5SmHB-BTwst47g1wQ_5VBsKmqmBzkpDc8m1neBp2_zYCHl7GCawm7J-L2ub9BrQNnAENAcT7pNnKv9s1IgmxX42zHxvwTj8pnVTO9fKhXIyk8YJ_RwOT4D_FjAkcLcIeIvzgh9YFR_vhHaM-5bWF3T_42JVu6O4uhmvBhK8lPsWXxgrjOW0xzJPdq9355DSIVsQWWzsg-S328",
        ],
        days: 9,
        location: "France/Italy",
        price: 1550,
        childPrice: 1100,
        difficulty: "Moderate",
        isLastMinute: false,
        overview: "Classic circuit around Western Europe's highest mountain.",
        highlights: ["Three countries", "Alpine culture"],
        maxAltitude: "2,500m",
        bestSeason: "Jun-Sep",
        startPoint: "Chamonix",
        endPoint: "Chamonix",
        minPax: 2,
        maxPax: 15,
        itinerary: [],
        included: [],
        excluded: [],
    },
    {
        id: "kumano-kodo-pilgrimage",
        title: "Kumano Kodo Pilgrimage",
        images: [
            "https://lh3.googleusercontent.com/aida-public/AB6AXuD-Uh-b-5T5sNylQHxrSM2pqx6nKckTZDyuzFFQ3Bj2XdAPlzbzaSdlIBzi_EK-Tuo6c8n4lNQ6EPVhaqb9igzHx_CADH8BTFJjynASu5IMbRhBaPm3sm40ZYX7KyInJHnNe_7e1zGort34W320TQ-bs0gyK32DiBmf8XTtQ3flZIwAI3OT5nrrjynS5MqJxlOIYvcqmSd1TvwoyqrfVXeHrW6NP2vAF1ycyFYZGjDFEabnxW_ml12NCPCVstXevyrdLf89wc9DcOg",
        ],
        days: 6,
        location: "Japan",
        price: 1150,
        childPrice: 850,
        difficulty: "Easy",
        isLastMinute: false,
        overview: "Ancient pilgrimage routes in the Kii Mountains.",
        highlights: ["Shines", "Onsens"],
        maxAltitude: "800m",
        bestSeason: "Mar-May, Oct-Nov",
        startPoint: "Kyoto",
        endPoint: "Osaka",
        minPax: 1,
        maxPax: 10,
        itinerary: [],
        included: [],
        excluded: [],
    },
];
