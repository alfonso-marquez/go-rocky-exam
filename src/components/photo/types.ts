export interface Photo {
  id: number;
  title: string;
  description: string;
  taken_at: Date;
  camera_model: string;
  details: string;
  url: string;
  album_id: number;
  user_id: string;
  created_at: string | number | Date;
  profiles: Profile | null;
}

export interface Profile {
  first_name: string;
  last_name: string;
}
