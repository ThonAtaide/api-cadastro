import {InvalidParameterError, MissingParameterError} from "../../exceptions";

export interface AddressDto {
    id?: number;
    user_profile_id?: number;
    city_state: string;
    city: string;
    neighbor: string;
    street: string;
    house_number: string;
    postal_code: string;
}

export class AddressFieldsValidator {

    public static validateCity(city: string) {
        if (!city) {
            throw new MissingParameterError('City field is required.');
        }
        if (city.length > 50) {
            throw new InvalidParameterError('City size is bigger than allowed.', null);
        }
    }

    public static validateCityState(city_state: string) {
        if (!city_state) {
            throw new MissingParameterError('City state field is required.');
        }
        if (city_state && city_state.length > 50) {
            throw new InvalidParameterError('City state size is bigger than allowed.', null);
        }
    }

    public static validateNeighbor(neighbor: string) {
        if (neighbor && neighbor.length > 50) {
            throw new InvalidParameterError('Neighbor size is bigger than allowed.', null);
        }
    }

    public static validateStreet(street: string) {
        if (!street) {
            throw new MissingParameterError('Street field is required.');
        }
        if (street && street.length > 50) {
            throw new InvalidParameterError('Street size is bigger than allowed.', null);
        }
    }

    public static validateHouseNumber(house_number: string) {
        if (!house_number) {
            throw new MissingParameterError('House number field is required.');
        }
        if (house_number && house_number.length > 50) {
            throw new InvalidParameterError('House number size is bigger than allowed.', null);
        }
    }

    public static validatePostalCode(postal_code: string) {
        if (postal_code && postal_code.length > 20) {
            throw new InvalidParameterError('Postal code size is bigger than allowed.', null);
        }
    }
}
