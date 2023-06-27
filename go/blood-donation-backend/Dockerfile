# First stage: Build the backend service
FROM golang:1.17-alpine AS build

WORKDIR /app

# Copy go.mod and go.sum files to download dependencies
COPY go.mod go.sum ./
RUN go mod download

# Copy the source code to the container
COPY . .

# Build the backend service
RUN CGO_ENABLED=0 GOOS=linux go build -a -o blood-donation-service .

# Second stage: Run the backend service
FROM alpine:latest

# Build arguments for user/group configurations
ARG USER=wso2iamappdev
ARG USER_ID=10001
ARG USER_GROUP=wso2
ARG USER_GROUP_ID=10001
ARG USER_HOME=/home/${USER}

# Create a non-privileged user with UID 10001
RUN addgroup -S -g ${USER_GROUP_ID} ${USER_GROUP} \
    && adduser -S -D -H -h ${USER_HOME} -s /sbin/nologin -G ${USER_GROUP} -u ${USER_ID} ${USER}

# Copy the built backend service to the container
COPY --chown=${USER}:${USER_GROUP} --from=build /app/blood-donation-service ${USER_HOME}/

# Set the user to the non-privileged user
USER 10001

# Set the working directory to the user's home directory
WORKDIR ${USER_HOME}

# Expose the port on which the backend service will run
EXPOSE 9098

# Run the backend service
CMD ["./blood-donation-service"]
