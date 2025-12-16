package com.reservation.notification.config;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ConfigurationRabbitMQ {

    public static final String QUEUE_NOTIFICATION = "queue.notification";
    public static final String EXCHANGE_RESERVATION = "exchange.reservation";
    public static final String ROUTING_KEY_CONFIRMATION = "reservation.confirmation";

    @Bean
    public Queue queueNotification() {
        return new Queue(QUEUE_NOTIFICATION, true);
    }

    @Bean
    public TopicExchange exchangeReservation() {
        return new TopicExchange(EXCHANGE_RESERVATION);
    }

    @Bean
    public Binding binding(Queue queueNotification, TopicExchange exchangeReservation) {
        return BindingBuilder
                .bind(queueNotification)
                .to(exchangeReservation)
                .with(ROUTING_KEY_CONFIRMATION);
    }

    @Bean
    public MessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) {
        RabbitTemplate rabbitTemplate = new RabbitTemplate(connectionFactory);
        rabbitTemplate.setMessageConverter(jsonMessageConverter());
        return rabbitTemplate;
    }
}
