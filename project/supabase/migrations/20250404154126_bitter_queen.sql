/*
  # Meal Planner Schema

  1. New Tables
    - meal_plans
      - id (uuid, primary key)
      - user_id (uuid, references auth.users)
      - date (date)
      - created_at (timestamp)
      - updated_at (timestamp)
    
    - planned_meals
      - id (uuid, primary key)
      - meal_plan_id (uuid, references meal_plans)
      - recipe_id (text)
      - meal_type (text)
      - servings (integer)
      - notes (text)
      - created_at (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage their meal plans
*/

-- Create meal_plans table
CREATE TABLE IF NOT EXISTS meal_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  date date NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE (user_id, date)
);

-- Create planned_meals table
CREATE TABLE IF NOT EXISTS planned_meals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  meal_plan_id uuid REFERENCES meal_plans ON DELETE CASCADE,
  recipe_id text NOT NULL,
  meal_type text NOT NULL,
  servings integer DEFAULT 1,
  notes text,
  created_at timestamptz DEFAULT now(),
  CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack'))
);

-- Enable Row Level Security
ALTER TABLE meal_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE planned_meals ENABLE ROW LEVEL SECURITY;

-- Policies for meal_plans
CREATE POLICY "Users can create their own meal plans"
  ON meal_plans
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own meal plans"
  ON meal_plans
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own meal plans"
  ON meal_plans
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own meal plans"
  ON meal_plans
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for planned_meals
CREATE POLICY "Users can manage their planned meals"
  ON planned_meals
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM meal_plans
      WHERE meal_plans.id = planned_meals.meal_plan_id
      AND meal_plans.user_id = auth.uid()
    )
  );