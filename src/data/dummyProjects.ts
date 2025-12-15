// Dummy data for projects - used as fallback when API doesn't return data
export interface DummyProject {
    id: number;
    title: string;
    description: string;
    thumbnail: string;
    app_icon: string;
    category: "merge" | "non-merge";
    team_id: number;
    team_name: string;
    batch: number;
    big_idea: string;
    frontend_demo: string;
    is_published: boolean;
    created_at: string;
    updated_at: string;
}

export const dummyProjects: DummyProject[] = [
    {
        id: 1,
        title: "EcoTrack",
        description:
            "EcoTrack adalah aplikasi web inovatif yang membantu pengguna melacak dan mengurangi jejak karbon mereka. Dengan fitur tracking harian, pengguna dapat memantau aktivitas yang berkontribusi pada emisi karbon seperti transportasi, konsumsi energi, dan pola makan. Aplikasi ini juga menyediakan rekomendasi personal untuk mengurangi dampak lingkungan dan mencapai target sustainability.",
        thumbnail: "https://images.unsplash.com/photo-1518173946687-a4c036bc7ee7?w=800&h=600&fit=crop",
        app_icon: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=200&h=200&fit=crop",
        category: "merge",
        team_id: 1,
        team_name: "Green Innovators",
        batch: 7,
        big_idea:
            "Memberdayakan individu untuk mengambil tindakan nyata dalam mengurangi dampak lingkungan melalui tracking dan gamifikasi jejak karbon personal.",
        frontend_demo: "https://ecotrack-demo.vercel.app",
        is_published: true,
        created_at: "2024-11-15T10:00:00Z",
        updated_at: "2024-11-20T14:30:00Z",
    },
    {
        id: 2,
        title: "MediCare AI",
        description:
            "MediCare AI adalah platform kesehatan digital yang menggunakan kecerdasan buatan untuk membantu pengguna memahami gejala kesehatan mereka. Dengan chatbot AI yang terlatih, pengguna dapat berkonsultasi awal tentang keluhan kesehatan dan mendapatkan rekomendasi kapan harus mengunjungi dokter. Platform ini juga terintegrasi dengan sistem penjadwalan rumah sakit.",
        thumbnail: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=600&fit=crop",
        app_icon: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=200&h=200&fit=crop",
        category: "merge",
        team_id: 2,
        team_name: "Health Tech Squad",
        batch: 7,
        big_idea:
            "Demokratisasi akses kesehatan dengan menyediakan konsultasi awal berbasis AI yang akurat dan terpercaya untuk semua kalangan.",
        frontend_demo: "https://medicare-ai-demo.netlify.app",
        is_published: true,
        created_at: "2024-11-10T08:00:00Z",
        updated_at: "2024-11-18T16:45:00Z",
    },
    {
        id: 3,
        title: "LearnPath",
        description:
            "LearnPath adalah platform e-learning yang menyediakan jalur pembelajaran terstruktur untuk berbagai skill teknologi. Dengan kurikulum yang dikurasi oleh expert dan sistem tracking progress yang komprehensif, pengguna dapat belajar dengan efektif. Platform mendukung berbagai format konten seperti video, artikel, dan hands-on projects.",
        thumbnail: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop",
        app_icon: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=200&h=200&fit=crop",
        category: "non-merge",
        team_id: 3,
        team_name: "EduTech Pioneers",
        batch: 7,
        big_idea:
            "Menyediakan pengalaman belajar yang terpersonalisasi dan terstruktur untuk membantu siapa saja menguasai skill teknologi dengan efektif.",
        frontend_demo: "https://learnpath-demo.vercel.app",
        is_published: true,
        created_at: "2024-11-05T09:30:00Z",
        updated_at: "2024-11-15T11:20:00Z",
    },
    {
        id: 4,
        title: "FoodScan",
        description:
            "FoodScan adalah aplikasi yang menggunakan computer vision untuk mengidentifikasi makanan dan memberikan informasi nutrisi secara instan. Pengguna cukup mengambil foto makanan, dan AI akan menganalisis kandungan kalori, protein, karbohidrat, dan nutrisi lainnya. Fitur tracking harian membantu pengguna mencapai target diet mereka.",
        thumbnail: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800&h=600&fit=crop",
        app_icon: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=200&h=200&fit=crop",
        category: "merge",
        team_id: 4,
        team_name: "NutriVision",
        batch: 7,
        big_idea:
            "Memudahkan tracking nutrisi dengan teknologi AI vision, membuat hidup sehat lebih accessible untuk semua orang.",
        frontend_demo: "https://foodscan-app.netlify.app",
        is_published: true,
        created_at: "2024-11-08T07:15:00Z",
        updated_at: "2024-11-19T13:00:00Z",
    },
    {
        id: 5,
        title: "TaskFlow",
        description:
            "TaskFlow adalah aplikasi manajemen proyek modern yang dirancang khusus untuk tim remote. Dengan fitur kanban board yang intuitif, time tracking, dan integrasi dengan berbagai tools populer, TaskFlow membantu tim berkolaborasi dengan lebih efisien. Dashboard analytics memberikan insight tentang produktivitas tim.",
        thumbnail: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=600&fit=crop",
        app_icon: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=200&h=200&fit=crop",
        category: "non-merge",
        team_id: 5,
        team_name: "Productivity Labs",
        batch: 7,
        big_idea:
            "Meningkatkan produktivitas tim remote dengan tools kolaborasi yang seamless dan insight berbasis data.",
        frontend_demo: "https://taskflow-demo.vercel.app",
        is_published: true,
        created_at: "2024-11-12T11:00:00Z",
        updated_at: "2024-11-21T09:30:00Z",
    },
    {
        id: 6,
        title: "TravelBuddy",
        description:
            "TravelBuddy adalah platform perencanaan perjalanan lengkap yang menggunakan AI untuk memberikan rekomendasi destinasi berdasarkan preferensi pengguna. Aplikasi ini menyediakan fitur itinerary builder, budget tracker, dan community reviews. Pengguna juga dapat berbagi pengalaman perjalanan mereka dengan traveler lainnya.",
        thumbnail: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop",
        app_icon: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=200&h=200&fit=crop",
        category: "merge",
        team_id: 6,
        team_name: "Wanderlust Devs",
        batch: 7,
        big_idea:
            "Mengubah cara orang merencanakan perjalanan dengan AI-powered recommendations dan community-driven insights.",
        frontend_demo: "https://travelbuddy-demo.netlify.app",
        is_published: true,
        created_at: "2024-11-14T13:45:00Z",
        updated_at: "2024-11-22T10:15:00Z",
    },
];

// Helper function to get project by ID
export const getDummyProjectById = (id: number | string): DummyProject | undefined => {
    return dummyProjects.find((p) => p.id === Number(id));
};
