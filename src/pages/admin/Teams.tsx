import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getAllTeams, getTeamById, type Team } from "../../api/team.api";
import { getAllBatches, type Batch } from "../../api/batch.api";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../components/ui/select";
import {
    Users,
    Search,
    Filter,
    Loader2,
    AlertCircle,
    ChevronDown,
    X,
    FolderKanban,
    GraduationCap,
    Crown,
} from "lucide-react";

const roleLabels: Record<string, string> = {
    hustler: "Hustler / PM",
    hacker: "Hacker",
    scrum_master: "Scrum Master",
    design_researcher: "Design Researcher",
    data_engineer: "Data Engineer",
    ml_engineer: "ML Engineer",
    ml_ops: "ML Ops",
};

const roleColors: Record<string, string> = {
    hustler: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    hacker: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    scrum_master: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    design_researcher: "bg-pink-500/20 text-pink-400 border-pink-500/30",
    data_engineer: "bg-green-500/20 text-green-400 border-green-500/30",
    ml_engineer: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    ml_ops: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
};

export default function AdminTeams() {
    const [teams, setTeams] = useState<Team[]>([]);
    const [batches, setBatches] = useState<Batch[]>([]);
    const [selectedBatch, setSelectedBatch] = useState<number | null>(null);
    const [expandedTeam, setExpandedTeam] = useState<number | null>(null);
    const [expandedTeamData, setExpandedTeamData] = useState<Team | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingTeam, setIsLoadingTeam] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [teamsRes, batchesRes] = await Promise.all([
                    getAllTeams(selectedBatch || undefined),
                    getAllBatches(),
                ]);
                setTeams(teamsRes.data);
                setBatches(batchesRes.data);
                setError(null);
            } catch (err) {
                console.error(err);
                setError("Failed to load teams");
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [selectedBatch]);

    const handleExpandTeam = async (teamId: number) => {
        if (expandedTeam === teamId) {
            setExpandedTeam(null);
            setExpandedTeamData(null);
            return;
        }

        setExpandedTeam(teamId);
        setIsLoadingTeam(true);
        try {
            const res = await getTeamById(teamId);
            setExpandedTeamData(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoadingTeam(false);
        }
    };

    const filteredTeams = teams.filter(
        (team) =>
            team.team_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            team.project_title?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-10 h-10 text-[#8A3DFF] animate-spin" />
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-5xl mx-auto"
        >
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl lg:text-3xl font-bold mb-2">Teams</h1>
                <p className="text-muted-foreground">
                    View project teams and their members
                </p>
            </div>

            {/* Error Alert */}
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3"
                    >
                        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                        <p className="text-red-400 text-sm flex-1">{error}</p>
                        <button onClick={() => setError(null)}>
                            <X className="w-4 h-4 text-red-400" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search teams or projects..."
                        className="w-full pl-12 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-[#8A3DFF]/50 focus:outline-none focus:ring-2 focus:ring-[#8A3DFF]/20"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Filter className="w-5 h-5 text-muted-foreground" />
                    <Select
                        value={selectedBatch ? String(selectedBatch) : "all"}
                        onValueChange={(value) =>
                            setSelectedBatch(value === "all" ? null : Number(value))
                        }
                    >
                        <SelectTrigger className="min-w-[150px]">
                            <SelectValue placeholder="All Batches" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Batches</SelectItem>
                            {batches.map((batch) => (
                                <SelectItem key={batch.id} value={String(batch.batch_number)}>
                                    Batch {batch.batch_number}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Teams List */}
            <div className="space-y-4">
                {filteredTeams.length === 0 ? (
                    <Card className="bg-card border-white/5">
                        <CardContent className="p-12 text-center">
                            <Users className="w-12 h-12 text-[#8A3DFF]/30 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No teams found</h3>
                            <p className="text-muted-foreground">
                                {searchQuery
                                    ? "Try a different search term"
                                    : "No teams available"}
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    filteredTeams.map((team) => (
                        <motion.div key={team.id} layout>
                            <Card
                                className={`bg-card border-white/5 hover:border-[#8A3DFF]/30 transition-all cursor-pointer ${expandedTeam === team.id ? "border-[#8A3DFF]/30" : ""
                                    }`}
                                onClick={() => handleExpandTeam(team.id)}
                            >
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-[#8A3DFF]/10 flex items-center justify-center">
                                                <Users className="w-6 h-6 text-[#8A3DFF]" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-lg">{team.team_name}</h3>
                                                <div className="flex items-center gap-3 mt-1">
                                                    <Badge className="bg-white/10 text-muted-foreground border-white/20">
                                                        Batch {team.batch}
                                                    </Badge>
                                                    {team.project_title && (
                                                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                                                            <FolderKanban className="w-4 h-4" />
                                                            {team.project_title}
                                                        </span>
                                                    )}
                                                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                                                        <GraduationCap className="w-4 h-4" />
                                                        {team.member_count || 0} members
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <motion.div
                                            animate={{ rotate: expandedTeam === team.id ? 180 : 0 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <ChevronDown className="w-5 h-5 text-muted-foreground" />
                                        </motion.div>
                                    </div>

                                    {/* Expanded Members Section */}
                                    <AnimatePresence>
                                        {expandedTeam === team.id && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: "auto" }}
                                                exit={{ opacity: 0, height: 0 }}
                                                transition={{ duration: 0.2 }}
                                                className="mt-6 pt-6 border-t border-white/10"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <h4 className="text-sm font-medium text-muted-foreground mb-4">
                                                    Team Members
                                                </h4>
                                                {isLoadingTeam ? (
                                                    <div className="flex items-center justify-center py-8">
                                                        <Loader2 className="w-6 h-6 text-[#8A3DFF] animate-spin" />
                                                    </div>
                                                ) : expandedTeamData?.members &&
                                                    expandedTeamData.members.length > 0 ? (
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                                        {expandedTeamData.members.map((member) => (
                                                            <div
                                                                key={member.id}
                                                                className="p-4 rounded-xl bg-white/5 border border-white/10"
                                                            >
                                                                <div className="flex items-start justify-between mb-2">
                                                                    <p className="font-medium">{member.name}</p>
                                                                    {member.is_scrum_master && (
                                                                        <Crown className="w-4 h-4 text-yellow-400" />
                                                                    )}
                                                                </div>
                                                                <Badge
                                                                    className={
                                                                        roleColors[member.role] ||
                                                                        "bg-white/10 text-muted-foreground"
                                                                    }
                                                                >
                                                                    {roleLabels[member.role] || member.role}
                                                                </Badge>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <p className="text-muted-foreground text-sm py-4">
                                                        No members in this team yet
                                                    </p>
                                                )}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))
                )}
            </div>
        </motion.div>
    );
}
