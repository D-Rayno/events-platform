-- MySQL Initialization Script
-- This script runs once when the database is first created
-- It ensures all users use the modern caching_sha2_password plugin

-- Note: host_cache_size will be set via my.cnf configuration file
-- No need to set it here as it's a startup parameter

-- Flush privileges to apply changes
SET GLOBAL host_cache_size = 0;
FLUSH PRIVILEGES;