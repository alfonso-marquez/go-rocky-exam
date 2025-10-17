import { Photo } from "../photo/types";

export interface Album {
  id: string;
  name: string;
  description: string;
  photos: Photo[];
}
