# Use a Golang image for the backend
FROM golang:1.18-alpine

WORKDIR /app

# Copy module files and download dependencies
COPY go.mod go.sum ./
RUN go mod download

# Copy the rest of the source code
COPY . .

# Build the application
RUN go build -o main .

# Expose the port on which your server runs
EXPOSE 8080

# Run the server
CMD ["./main"]
