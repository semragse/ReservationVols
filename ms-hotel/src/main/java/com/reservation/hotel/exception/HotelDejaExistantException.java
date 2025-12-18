package com.reservation.hotel.exception;

public class HotelDejaExistantException extends RuntimeException {
    public HotelDejaExistantException(String message) {
        super(message);
    }
}
