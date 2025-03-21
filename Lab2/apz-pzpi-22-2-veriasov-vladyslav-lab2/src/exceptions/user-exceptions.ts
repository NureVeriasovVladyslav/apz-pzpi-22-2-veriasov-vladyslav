export class RentalNotFoundException extends Error {
    constructor(message: string) {
      super(message);
      this.name = "RentalNotFoundException";
    }
  }
  
  export class InvalidRentalDataException extends Error {
    constructor(message: string) {
      super(message);
      this.name = "InvalidRentalDataException";
    }
  }