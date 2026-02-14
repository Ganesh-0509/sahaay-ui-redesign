import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "@/lib/api";
import {
    Calendar,
    ChevronRight,
    MessageSquare,
    History as HistoryIcon,
    Search,
    ArrowLeft,
    RefreshCw
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface DailySummary {
    id: string;
    dayKey: string;
    summary: string;
    topEmotions: string[];
    messageCount: number;
}

const ChatHistory = () => {
    const [history, setHistory] = useState<DailySummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [search, setSearch] = useState("");

    const fetchHistory = useCallback(async (isRefresh = false) => {
        if (isRefresh) setRefreshing(true);
        else setLoading(true);

        try {
            const res = await apiFetch<{ history: DailySummary[] }>("/api/chat/history");
            setHistory(res.history || []);
        } catch (error) {
            console.error("Failed to fetch history:", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchHistory();
    }, [fetchHistory]);

    const filteredHistory = history.filter(item =>
        item.summary.toLowerCase().includes(search.toLowerCase()) ||
        item.dayKey.includes(search)
    );

    const formatDateString = (dateStr: string) => {
        try {
            // dayKey is yyyy-MM-dd
            return format(parseISO(dateStr), "EEEE, MMMM do, yyyy");
        } catch {
            return dateStr;
        }
    };

    return (
        <div className="mx-auto max-w-4xl space-y-8 pb-12 animate-fade-in">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Link
                            to="/chat"
                            className="p-2 -ml-2 rounded-full hover:bg-surface-muted transition-colors"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                        <h1 className="font-display text-3xl font-bold text-foreground">Chat History</h1>
                    </div>
                    <p className="text-muted-foreground italic">
                        "Your journey, one conversation at a time 🌿"
                    </p>
                </div>
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => fetchHistory(true)}
                    disabled={refreshing || loading}
                    className="rounded-xl h-10 w-10"
                >
                    <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
                </Button>
            </div>

            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search through your past conversations..."
                    className="pl-10 h-12 rounded-2xl border-border/50 bg-card shadow-sm"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {loading ? (
                <div className="grid gap-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-32 rounded-3xl bg-surface-muted animate-pulse" />
                    ))}
                </div>
            ) : filteredHistory.length > 0 ? (
                <div className="grid gap-6">
                    {filteredHistory.map((item) => (
                        <Link
                            key={item.id}
                            to={`/chat?day=${item.dayKey}`}
                            className="group relative flex flex-col gap-4 rounded-3xl border border-border/50 bg-card p-6 shadow-sm transition-all hover:border-primary/30 hover:shadow-md hover:-translate-y-0.5"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                        <Calendar className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-foreground">
                                            {formatDateString(item.dayKey)}
                                        </h3>
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <MessageSquare className="h-3 w-3" />
                                            {item.messageCount} messages
                                        </div>
                                    </div>
                                </div>
                                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                            </div>

                            <div className="text-sm leading-relaxed text-muted-foreground line-clamp-2">
                                {item.summary}
                            </div>

                            {item.topEmotions.length > 0 && (
                                <div className="flex flex-wrap gap-2 pt-2">
                                    {item.topEmotions.map(emotion => (
                                        <span
                                            key={emotion}
                                            className="rounded-full bg-surface-muted px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground border border-border/30"
                                        >
                                            {emotion}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-surface-muted mb-4 opacity-50">
                        <HistoryIcon className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">No history found</h3>
                    <p className="text-muted-foreground max-w-sm mt-2">
                        {search ? "We couldn't find any conversations matching your search." : "Start chatting with Sahaay to see your history here!"}
                    </p>
                    {!search && (
                        <Button asChild className="mt-6 rounded-2xl" variant="outline">
                            <Link to="/chat">Start a conversation</Link>
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
};

export default ChatHistory;
