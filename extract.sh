#!/bin/bash
PROJECT="/Users/tanujkashyap/Salon/Salon-Admin-console/Salon-Admin-Console/PROJECT_CODEBASE.md"
BASE_DIR="/Users/tanujkashyap/Salon/Salon-Admin-console/Salon-Admin-Console"

extract_file() {
    local start_line=$1
    local end_line=$2
    local output_file=$3
    echo "Extracting lines $start_line to $end_line to $output_file"
    sed -n "${start_line},${end_line}p" "$PROJECT" > "$BASE_DIR/$output_file"
}

# Dashboard
extract_file 2397 2533 "src/features/dashboard/pages/Dashboard.jsx"

# Salons & Business
extract_file 3048 4228 "src/features/salons/pages/MyAdminSalon.jsx"
extract_file 4232 4481 "src/features/salons/pages/PendingSalons.jsx"
extract_file 4485 4899 "src/features/salons/pages/VerifySalon.jsx"

# Services
extract_file 4903 5624 "src/features/services/pages/Services.jsx"

# Staff
extract_file 5628 6566 "src/features/staff/pages/Staff.jsx"

# Timings
extract_file 6570 7033 "src/features/business/pages/Timings.jsx"

# Banner
extract_file 7037 7227 "src/features/business/pages/Banner.jsx"

# Reviews
extract_file 2538 3042 "src/features/reviews/pages/SalonReviews.jsx"

echo "Extraction complete."
