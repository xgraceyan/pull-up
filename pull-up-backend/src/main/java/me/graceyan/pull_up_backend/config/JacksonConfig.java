package me.graceyan.pull_up_backend.config;

import com.fasterxml.jackson.datatype.jsr310.deser.LocalTimeDeserializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalTimeSerializer;
import org.springframework.boot.autoconfigure.jackson.Jackson2ObjectMapperBuilderCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.format.DateTimeFormatter;

@Configuration
public class JacksonConfig {
    @Bean
    public Jackson2ObjectMapperBuilderCustomizer jsonCustomizer() {
        return builder -> builder.simpleDateFormat("H:mm")
                .serializers(new LocalTimeSerializer(DateTimeFormatter.ofPattern("H:mm")))
                .deserializers(new LocalTimeDeserializer(DateTimeFormatter.ofPattern("H:mm")));
    }
}
