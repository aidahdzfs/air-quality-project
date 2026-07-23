# --- Stage 1: Build ---
FROM golang:1.26-alpine AS builder

WORKDIR /app

# Copy go.mod & go.sum dulu supaya layer cache Docker optimal
# (dependency cuma di-download ulang kalau go.mod/go.sum berubah)
COPY go.mod go.sum ./
RUN go mod download

# Copy sisa source code
COPY . .

# Build binary statis dari entrypoint cmd/server
# CGO_ENABLED=0 supaya binary tidak butuh library C dari OS (penting untuk alpine)
RUN CGO_ENABLED=0 GOOS=linux go build -o server ./cmd/server

# --- Stage 2: Run ---
FROM alpine:latest

# Sertifikat SSL diperlukan karena backend ini fetch ke API eksternal (WAQI) via HTTPS
RUN apk --no-cache add ca-certificates

WORKDIR /app

# Copy HANYA binary hasil build dari stage sebelumnya (image jadi kecil, tidak bawa source Go/toolchain)
COPY --from=builder /app/server .

# Dokumentasi port (aktual port ditentukan lewat env var PORT saat runtime)
EXPOSE 8080

CMD ["./server"]