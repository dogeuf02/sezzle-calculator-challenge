# Stage 1: Build the binary
FROM golang:1.22-alpine AS builder

WORKDIR /app

# Install git and certificates
RUN apk add --no-cache git ca-certificates

# Cache dependencies
COPY go.mod go.sum* ./
RUN go mod download || true
# Copy source code
COPY . .

# Compile static binary with optimizations
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build \
    -ldflags="-w -s" \
    -o /app/server ./cmd/server

# Stage 2: Minimal runtime
FROM alpine:3.20

WORKDIR /app

# Install CA certificates for outbound HTTPS (if needed) and create non-root user
RUN apk --no-cache add ca-certificates && \
    addgroup -S appgroup && adduser -S appuser -G appgroup

COPY --from=builder /app/server /app/server

# Ensure non-root ownership
USER appuser:appgroup

EXPOSE 8080

ENTRYPOINT ["/app/server"]