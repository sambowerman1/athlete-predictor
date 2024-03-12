import pandas as pd
import re

def convert_name(name):
    # Convert "Last, First" to "First Last" format
    parts = name.split(', ')
    if len(parts) == 2:
        return f"{parts[1]} {parts[0]}"
    return name

def time_to_seconds(time_str):
    # Convert time strings to seconds, handling special cases
    clean_time_str = re.sub(r"@\s*|\(.*?\)|[^\d:.]", "", time_str).strip()
    parts = clean_time_str.split(":")
    if len(parts) == 2:
        return str(int(parts[0]) * 60 + float(parts[1]))
    return clean_time_str

def load_and_prepare_df(file_path, name_field, time_field, is_college=False):
    df = pd.read_csv(file_path)
    if is_college:
        df[name_field] = df[name_field].apply(convert_name)
    df[time_field] = df[time_field].apply(time_to_seconds)
    return df

# Load and prepare the datasets
boys_path = input("Enter HS Path: ")
college_path = input("Enter College Path: ")

boys_df = load_and_prepare_df(boys_path, 'Athlete', 'Mark')
college_df = load_and_prepare_df(college_path, 'Athlete', 'Time', is_college=True)

# Merge the DataFrames on the 'Athlete' names
consolidated_df = pd.merge(boys_df, college_df, on='Athlete', how='inner')

# Select and rename the relevant columns for the output
consolidated_df = consolidated_df[['Division', 'Mark', 'Time']].rename(columns={'Mark': 'PR', 'Time': 'CollegePR'})

# Verify and save the output
print("Consolidated DF is not empty:", not consolidated_df.empty)
output_path = input("Enter the output path + name.csv: ")
consolidated_df.to_csv(output_path, index=False)

print(f"Consolidated data saved to {output_path}")
