import pandas as pd
import re
def CleanAndMerge(BoysPath, CollegePath, OutputPath):
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
    # boys_path = input("Enter HS Path: ")
    # college_path = input("Enter College Path: ")

    boys_df = load_and_prepare_df(BoysPath, 'Athlete', 'Mark')
    college_df = load_and_prepare_df(CollegePath, 'Athlete', 'Time', is_college=True)

    # Merge the DataFrames on the 'Athlete' names
    consolidated_df = pd.merge(boys_df, college_df, on='Athlete', how='inner')

    # Select and rename the relevant columns for the output
    consolidated_df = consolidated_df[['Division', 'Mark', 'Time']].rename(columns={'Mark': 'PR', 'Time': 'CollegePR'})

    # Verify and save the output
    print("Consolidated DF is not empty:", not consolidated_df.empty)
    # output_path = input("Enter the output path + name.csv: ")
    consolidated_df.to_csv(OutputPath, index=False)

    print(f"Consolidated data saved to {OutputPath}")

# ------------------------------------------------------------------
    
from webscrape import scrape
import signal
def handler(signum, frame):
    raise Exception("End of time")
signal.signal(signal.SIGALRM, handler)

import pandas as pd
from sklearn.model_selection import train_test_split 
from sklearn.linear_model import LinearRegression
from sklearn import metrics


# def linear_regression(Path):
#     df = pd.read_csv(Path)

#     # Reshape the data to 2D arrays (which is required by the LinearRegression model)
#     X = df['PR'].values.reshape(-1,1)
#     Y = df['CollegePR'].values.reshape(-1,1)

#     # Split the data into training set and test set
#     X_train, X_test, Y_train, Y_test = train_test_split(X, Y, test_size=0.2, random_state=0)

#     # Create a LinearRegression object
#     model = LinearRegression()

#     # Train the model using the training sets
#     model.fit(X_train, Y_train)

#     # Make predictions using the testing set
#     Y_pred = model.predict(X_test)

#     # Print the coefficients
#     print('Coefficients: \n', model.coef_)

#     # Print the mean squared error
#     print('Mean squared error: %.2f' % metrics.mean_squared_error(Y_test, Y_pred))

#     # Print the coefficient of determination: 1 is perfect prediction
#     print('Coefficient of determination: %.2f' % metrics.r2_score(Y_test, Y_pred))


if __name__ == '__main__':


    

    BoysLink = 'https://www.athletic.net/TrackAndField/Division/Event.aspx?DivID=116302&Event=2&filter=11'
    WriteFile = '/Users/sam/Desktop/track csvs/events/mens200/Boys200.csv'
    BoysPath = WriteFile
    CollegePath = '/Users/sam/Desktop/track csvs/events/mens200/Mens200m.csv'
    OutputPath = '/Users/sam/Desktop/track csvs/events/mens200/Mens200mMatched.csv'
    signal.alarm(120)

    try:
        scrape(BoysLink, WriteFile)
    except Exception as e:
        print("Scraping stopped after 60 seconds.")
        
        # Cancel the alarm
    signal.alarm(0)

    CleanAndMerge(BoysPath, CollegePath, OutputPath)

    # linear_regression(OutputPath)