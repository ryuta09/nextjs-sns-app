export interface Post {
  id: string;
  content: string;
  createdAt: Date;
  likes: { userId: string }[];
  _count: { replies: number };
  author: {
    id: string;
    name: string | null;
    image: string | null;
  };
  username?: string
}