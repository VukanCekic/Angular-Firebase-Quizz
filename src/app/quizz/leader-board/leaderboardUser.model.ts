

export class LeaderboardUserModel {
  address: string;
  city: string;
  displayName: string;
  lastName: string;
  points: number;

  constructor(address: string, city: string, displayName: string, lastName: string, points: number) {
    this.address = address;
    this.city = city;
    this.displayName = displayName;
    this.lastName = lastName;
    this.points = points;
  }
}


