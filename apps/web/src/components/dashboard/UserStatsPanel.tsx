import { useUserStats, useBadges } from "@/lib/api/hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Trophy, 
  Zap, 
  Target, 
  Calendar,
  Star,
  Award,
  TrendingUp,
  Clock,
  Book,
  Brain
} from "lucide-react";

export function UserStatsPanel() {
  const { data: statsResponse, isLoading: statsLoading } = useUserStats();
  const { data: badgesResponse, isLoading: badgesLoading } = useBadges();

  const userStats = statsResponse?.success ? statsResponse.data?.stats : null;
  const achievements = statsResponse?.success ? statsResponse.data?.achievements || [] : [];
  const badges = badgesResponse?.success ? badgesResponse.data || [] : [];

  if (statsLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!userStats) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Brain className="w-12 h-12 mx-auto text-gray-400 mb-2" />
          <p className="text-muted-foreground">No stats available yet. Start learning to see your progress!</p>
        </CardContent>
      </Card>
    );
  }

  // Calculate level progress (mock calculation since API doesn't provide experience)
  const levelProgress = ((userStats.totalPoints % 1000) / 1000) * 100;

  return (
    <div className="space-y-6">
      {/* Main Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Level & Points */}
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-purple-700 flex items-center gap-2">
              <Star className="w-4 h-4" />
              Level & Points
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-purple-900">Level {userStats.level}</span>
                <span className="text-sm text-purple-600">{userStats.totalPoints} pts</span>
              </div>
              <Progress value={levelProgress} className="h-2 bg-purple-200" />
              <p className="text-xs text-purple-600">
                {1000 - (userStats.totalPoints % 1000)} pts to next level
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Study Streak */}
        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-orange-700 flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Study Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">{userStats.currentStreak} days</div>
            <p className="text-xs text-orange-600 mt-1">
              Best: {userStats.longestStreak} days
            </p>
          </CardContent>
        </Card>

        {/* Quizzes Completed */}
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-700 flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              Quizzes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">{userStats.quizzesCompleted}</div>
            <p className="text-xs text-green-600 mt-1">
              Avg: {userStats.averageQuizScore}%
            </p>
          </CardContent>
        </Card>

        {/* Rank */}
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 flex items-center gap-2">
              <Award className="w-4 h-4" />
              Rank
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">#{userStats.rank}</div>
            <p className="text-xs text-blue-600 mt-1">
              Overall rank
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Stats */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Study Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Book className="w-5 h-5" />
              Study Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Quizzes Completed</span>
              <span className="font-semibold">{userStats.quizzesCompleted}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Flashcards Reviewed</span>
              <span className="font-semibold">{userStats.flashcardsReviewed}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Total Study Time</span>
              <span className="font-semibold">
                {Math.floor(userStats.totalStudyTime / 60)}h {userStats.totalStudyTime % 60}m
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Global Rank</span>
              <span className="font-semibold text-blue-600">#{userStats.rank}</span>
            </div>
          </CardContent>
        </Card>

        {/* Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Average Quiz Score</span>
              <span className="font-semibold">{userStats.averageQuizScore}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Current Streak</span>
              <span className="font-semibold text-orange-600">{userStats.currentStreak} days</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Longest Streak</span>
              <span className="font-semibold text-green-600">{userStats.longestStreak} days</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Study Level</span>
              <div className="flex items-center gap-1">
                <span className="font-semibold">Level {userStats.level}</span>
                <Star className="w-4 h-4 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Achievements */}
      {achievements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              Recent Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {achievements.slice(0, 6).map((achievement: any, index: number) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-lg border bg-gray-50">
                  <div className="text-2xl">🏆</div>
                  <div>
                    <div className="font-semibold text-sm">{achievement.name}</div>
                    <div className="text-xs text-muted-foreground">{achievement.description}</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(achievement.earnedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Available Badges */}
      {!badgesLoading && badges.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              Available Badges
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {badges.slice(0, 6).map((badge: any, index: number) => (
                <div 
                  key={index} 
                  className={`flex items-center gap-3 p-3 rounded-lg border ${
                    badge.isEarned ? 'bg-green-50 border-green-200' : 'bg-gray-50'
                  }`}
                >
                  <div className="text-2xl">{badge.icon || '🎯'}</div>
                  <div>
                    <div className={`font-semibold text-sm ${
                      badge.isEarned ? 'text-green-800' : 'text-gray-700'
                    }`}>
                      {badge.name}
                    </div>
                    <div className="text-xs text-muted-foreground">{badge.description}</div>
                    {badge.isEarned && (
                      <Badge variant="outline" className="text-xs mt-1 border-green-300 text-green-700">
                        Earned
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}