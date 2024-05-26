import { NextFunction, Request, Response } from "express";
import { bookingData } from "../../domain_entities/BookingData";
import RoomModel from "../database/propertyRoom";

export async function checkRoomCount(req: Request, res: Response, next: NextFunction) {
    try {
        const bookingData: bookingData = req.body.bookingData;
        const roomId = bookingData.roomId;
        const room = await RoomModel.findById(roomId);
        console.log('room data :', room);

        if (room && room.numOfRoomLeft < bookingData.numberOfRoom) {
            console.log('number of rooms left :', room.numOfRoomLeft);
            console.log('number of rooms in booking :', bookingData.numberOfRoom);
            return res.status(401).json({ success: false, message: 'Sorry.. There are not enough rooms available now ..!' });
        } else {
            next();
        }
    } catch (error) {
        console.log('check room count middleware error :', error);
        return res.status(500).json({ success: false, message: 'Check room count middleware error' });
    }
}
