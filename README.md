## Overview

![Smart Waste Managament](/public/demo-1.png)
![Smart Waste Managament Dashboard](/public/demo-2.png)

## Demo

You can view a fully working demo at [smart-waste-management-kohl.vercel.app](https://smart-waste-management-kohl.vercel.app)

## Docs

Comprehensive documentation at [https://smart-waste-management-docs.vercel.app](https://smart-waste-management-docs.vercel.app)

## Setup

Prerequisites:

- Create account on Supabase - https://supabase.com
- Create Supabase organization
- Create Supabase project under the organization
- Copy the Supabase account access token - https://app.supabase.com/project/_/settings/api

- Create Mapbox account - https://www.mapbox.com/
- Copy the Mapbox account access token - https://account.mapbox.com/

Clone the repository

```text copy
git clone https://github.com/mairh/smart-waste-management.git
```

Duplicate .env.example to .env.local

```text copy
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your-mapbox-token
NEXT_PUBLIC_API_BASE_URL=your-api-base-url
```

Check Node.js version (Good practice to manage node versions using nvm)

```text copy
nvm use
```

Install packages using bun

```text copy
bun install
```

Run the application

```text copy
bun dev
```

Create sample DB schema on Supabase (SQL Editor)

```text copy
-- Devices table
CREATE TABLE devices (
    device_id VARCHAR(50) PRIMARY KEY,
    location_name VARCHAR(100),
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8)
);
-- Readings table
CREATE TABLE readings (
    reading_id SERIAL PRIMARY KEY,
    device_id VARCHAR(50) REFERENCES devices(device_id),
    timestamp TIMESTAMP,
    fullness_level INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

Create function to fetch avg readings (SQL Editor)

```text copy
CREATE OR REPLACE FUNCTION get_daily_average_fullness()
RETURNS TABLE(device_id text, average_fullness numeric) AS $$
BEGIN
  RETURN QUERY
  SELECT devices.device_id::text, AVG(readings.fullness_level) as average_fullness
  FROM readings
  JOIN devices ON readings.device_id = devices.device_id
  WHERE DATE(readings.timestamp) = CURRENT_DATE
  GROUP BY devices.device_id;
END;
$$ LANGUAGE plpgsql;
```

Extra: Run IOT data simulation to update the database for realtime visualization

```text copy
bun run start:simulation
```

## Deployment

The project can de deoployed to any number of cloud providers. Vercel is recommended to deploy the NextJS application which Github CI/CD integrated.

- Push the local reposity to Github
- Create a new project on Vercel and add the Github link to the project
- Vercel will automatically deploy the new project from Github
- Add the required env variables - https://vercel.com/docs/projects/environment-variables

```text copy
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your-mapbox-token
NEXT_PUBLIC_API_BASE_URL=your-api-base-url
```

## Project Structure

The project structure presents generally accepted guidelines and patterns for building scalable web applications.

The structure is _fractal_ meaning the available functionality is grouped primarily by feature rather than by file type. The module grouping can also be done based on the routes.

```text
smart-waste-managment
├── app                             # NestJS App Router Module
│   ├── (auth-pages)                # Auth related pages
│   │   ├── forgot-password/*       # Entry point for forgot password view
│   │   ├── sign-in/*               # Entry point for sign-in view
│   │   ├── sign-up/*               # Entry point for sign-up view
│   ├── api                         # API routes
│   │   ├── devices/*               # API routes for devices
│   │   └── readings/*              # API routes for readings
│   ├── auth/*                      # Auth route for redirection
│   ├── dashboard                   # Protected dashboard related pages
│   │   ├── components/*            # Components used in Dashboard view
│   │   └── reset-password/*        # Protected reset password pages
│   │   └── page.tsx                # Entry point for dashboard view
│   └── actions.ts                  # Helper actions for authorization
│   └── layout.tsx                  # Common layout for the application
│   └── page.tsx                    # Common view for the application
├── components                      # Shared components folder
│   ├── ui/*                        # Shadcn UI components
│   └── shared/*                    # Shared components used by the application
├── config/*                        # Site configuration
├── hooks/*                         # Universal hooks for theme configuration
├── lib/*                           # External libraries
├── pages/*                         # Pages folder to run IOT simulation on Vercel
│   ├── iot                         # Simmulator serverless function
├── public/*                        # Public folder for images, etc
├── styles/*                        # Global styles folder
├── types/*                         # Common types definition
├── utils                           # Utilities folder
│   ├── supabase/*                  # Supabase related utilities
├── .env.example                    # Env variables files needed for configuration
├── .nvmrc                          # For nodejs version control
├── components.json                 # Config file for Shadcn schema configuration
├── middleware.ts                   # Session middleware
├── next.config.mjs                 # NextJS config
├── package.json                    # Imported packages
├── tailwind.config.ts              # Tailwind css config
└── tsconfig.json                   # TS config
└── vercel.json                     # Vercel cron job setting
```

![Architecture](/public/architecture.png)

### Tech Stack

##### Package Manager

Using `Bun`

##### Language

Using `TypeScript`

##### Frontend

Using `React` with `NextJS` framework

##### Backend

Using `NextJS` server side API based on NodeJS

##### Database

Using `Supabase` postgres

##### Authentication

Using `Supabase authentication`

##### Maps

Using `Mapbox` to render map data

##### Charts

Using `Rechart` to render line chart

##### UI

Using `Shadcn` with `RadixUI`

##### IOT simulation

Using `MQTT`

##### Build and Deployment

Using `Vercel`

## Features

- Full stack app using latest NextJS v15 client and server components.
- Full authenication and authorization support using Supabase.
- Realtime subscription using Supabase.
- Modular codebase using fractal architecture.
- IOT simulation using vercel serverless function deployed as cron job.

## Assumptions and Constraints

- Public mqtt brokers have liomitation so do not abuse the public urls: you can switch to different brokers if you hit the limit. For e.g
  - mqtt://broker.hivemq.com
  - mqtt://test.mosquitto.org

- For Device's reading API (api/devices/[deviceId]/readings/route.ts), assumption made to calculate the last 30 readings
- For Avg fullness API (api/readings/average/route.ts), assumption made to calculate the daily average.