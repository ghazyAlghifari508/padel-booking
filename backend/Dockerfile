FROM golang:1.26-alpine AS build
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o /courtflow-api ./cmd/server

FROM alpine:3.22
WORKDIR /app
RUN adduser -D appuser
COPY --from=build /courtflow-api /usr/local/bin/courtflow-api
RUN mkdir -p /app/uploads/payment-proofs && chown -R appuser:appuser /app
USER appuser
EXPOSE 8080
CMD ["courtflow-api"]
