package me.graceyan.pull_up_backend.config;

import com.mongodb.lang.NonNull;
import org.springframework.core.convert.converter.Converter;
import org.springframework.data.convert.ReadingConverter;
import org.springframework.data.convert.WritingConverter;

import java.time.LocalTime;

public class LocalTimeConverters {
    // Converts local time to integer, because MongoDB stores LocalTime with a Date.

    public static int LocalTimeToInt(LocalTime time) {
        return time.getHour()*60 + time.getMinute();
    }

    @WritingConverter
    public static class LocalTimeToIntegerConverter implements Converter<LocalTime, Integer> {
        @Override
        public Integer convert(@NonNull LocalTime source) {
            return source.getHour()*60 + source.getMinute();
        }
    }

    @ReadingConverter
    public static class IntegerToLocalTimeConverter implements Converter<Integer, LocalTime> {
        @Override
        public LocalTime convert(@NonNull Integer source) {
            return LocalTime.of(source/60, source%60);
        }
    }
}
