package me.graceyan.pull_up_backend.request;

import lombok.Data;
import org.bson.types.ObjectId;

@Data
public class UserLoginRequest {
    private ObjectId eventId;
    private String name;
    private String passwordRaw;
}
