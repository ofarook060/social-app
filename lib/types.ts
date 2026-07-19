export interface User {
  userid: string;
  first_name: string;
  last_name: string;
  gender: string;
  type: 'profile' | 'group';
  profile_image: string;
  cover_image: string;
  email?: string;
  tag_name: string;
  url_address: string;
  about: string;
  likes: string;
  online: string;
  date: string;
  group_type?: string;
  owner?: string;
}

export interface Post {
  id: string;
  postid: string;
  post: string;
  image: string;
  has_image: string;
  is_profile_image: string;
  is_cover_image: string;
  parent: string;
  date: string;
  userid: string;
  owner: string;
  likes: string;
  comments: string;
  tags: string;
  first_name: string;
  last_name: string;
  profile_image: string;
  tag_name: string;
}

export interface Message {
  id: string;
  sender: string;
  receiver: string;
  message: string;
  file: string;
  seen: string;
  date: string;
}

export interface Thread {
  msgid: string;
  message: string;
  file: string;
  date: string;
  seen: string;
  other_user: User | null;
  unread_count: number;
}

export interface Notification {
  id: string;
  userid: string;
  activity: string;
  contentid: string;
  content_owner: string;
  content_type: string;
  date: string;
  seen: boolean;
  first_name: string;
  last_name: string;
  profile_image: string;
}

export interface Group {
  userid: string;
  first_name: string;
  profile_image: string;
  cover_image: string;
  group_type: string;
  about: string;
  owner: string;
  tag_name: string;
}
