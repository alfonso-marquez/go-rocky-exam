export interface Photo {
  id: number;
  name: string;
  description: string;
  taken_at: Date;
  camera_model: string;
  details: string;
  url: string;
  album_id: number;
  user_id: string;
  created_at: string | number | Date;
}
