export interface RideRequirement {
  name: string,
  highest_drop_height?: string, // (ride->highest_drop_height * 3) / 4 m
  number_of_drops?: string,
  max_speed?: string, // (ride->max_speed * 9) >> 18 mile/h
  ride_length?: string, // ride->length >> 16 m
  max_negative_g?: string,
  max_lateral_g?: string,
  inversion?: string,
  reverser_track_piece?: string,
  water_track_piece?: string,
  ride_type: string
}