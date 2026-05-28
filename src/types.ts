export interface Tweet {
  id: string;
  content: string;
  timestamp: string;
  likes: number;
  retweets: number;
  replies: number;
  impressions: number;
}

export interface FollowerHistoryPoint {
  date: string;
  count: number;
}

export interface TopicShare {
  name: string;
  percentage: number;
}

export interface DemographicPoint {
  label: string; // e.g. "United States", "18-24", "Male"
  percentage: number;
}

export interface AudienceInsights {
  regions: DemographicPoint[];
  genders: DemographicPoint[];
  professions: DemographicPoint[];
}

export interface XAccount {
  id: string;
  name: string;
  username: string;
  bio: string;
  followers: number;
  engagementRate: number; // e.g. 4.2 representing 4.2%
  verified: boolean;
  category: "AI" | "Crypto" | "Fitness" | "Finance" | "Startups" | "Coding" | "Marketing" | "Anime";
  tags: string[];
  profileImage: string;
  bannerImage: string;
  aiScore: number; // e.g. 92 out of 100
  growthRate: number; // e.g. 5.6 representing 5.6% monthly growth
  recentTweets: Tweet[];
  followerHistory: FollowerHistoryPoint[];
  popularTopics: TopicShare[];
  audienceInsights: AudienceInsights;
  tweetHeatmap: number[][]; // 7x24 grid (7 days of the week, 24 hourly buckets)
}
