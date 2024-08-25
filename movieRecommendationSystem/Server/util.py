

# importing required packages
import pandas as pd
import pickle
from scipy.sparse import csr_matrix
from rapidfuzz import process, fuzz




# importing source data and filtered data + cleaning the movie titles
movies = pd.read_csv('Source Data/movies.csv')
movies['title'] = movies['title'].str.replace(', The', '')
movies['title'] = movies['title'].str.replace(':', '')



final_dataset_filtered = pd.read_csv('Source Data/final_dataset_filtered.csv')
final_dataset_filtered_idxFalse = pd.read_csv('Source Data/final_dataset_filtered.csv', usecols=lambda column: column != 'movieId')




# creating the required dataframes from the above source data
csr_data = csr_matrix(final_dataset_filtered_idxFalse.values)
final_dataset_filtered.reset_index(inplace=True)



# importing the knn model as pkl
with open('Saved Model/knn_model.pkl', 'rb') as f:
    knn = pickle.load(f)



# creating a function to recommend movies when you enter a movie name
def get_movie_recommendation(movie_name):
    # number of movies to recommend
    n_movies_to_recommend = 10

    # create a list of movies that contains the input text in its titles
    # movie_list = movies[movies['title'].str.contains(movie_name)]

    # Get a list of matches sorted by similarity score
    matches = process.extract(movie_name, movies['title'], scorer=fuzz.ratio)

    # Convert matches to a DataFrame
    matches_df = pd.DataFrame(matches, columns=['title', 'similarity', 'index'])

    # Sort matches by similarity score
    matches_df = matches_df.sort_values(by='similarity', ascending=False)

    # print(matches_df)

    # Extract the top title
    top_title = matches_df['title'][0]

    # Filter the movies DataFrame
    movie_list = movies[movies['title'] == top_title]

    # if there are any movies
    if len(movie_list):

        # take the movieId of the first movie of the list created above
        movie_idx = movie_list.iloc[0]['movieId']

        # take the actual movie id and then map it back to the new index the movie got when you converted the pivot to a csr matrix

        try:
            movie_new_idx = final_dataset_filtered[final_dataset_filtered['movieId'] == movie_idx].index[0]
        except:
            recommend_frame_dict = "No Results"
            return recommend_frame_dict

        # distances variable stores the distance between the input movie and its nearest neighbors
        # indices stores the indices of the nearest neighbors in the the movie_idx list
        # we put +1 here so that we end up with 10 movies since the movie itself will be the closest to the input movie
        distances, indices = knn.kneighbors(csr_data[movie_new_idx], n_neighbors=n_movies_to_recommend + 1)

        # .squeeze().tolist() removes single-dimensional entries and converts the array to a Python list
        # zip function combines the elements of indices and distances into tuples
        # Converts the zipped tuples into a list of tuples.
        # Sorts the list of tuples based on the second element of each tuple, which is the distance
        # Slices the sorted list in order, excluding the first element (which would be the movie itself as the closest neighbor) and order the remaining elements in ascending order

        rec_movie_indices = sorted(list(zip(indices.squeeze().tolist(), distances.squeeze().tolist())),
                                   key=lambda x: x[1])[0:]

        recommend_frame = []
        recommend_frame_dict = {}

        # looping through the closest neighbors from the above list
        for val in rec_movie_indices:
            # retrieves the originL movie ID of recommended movies from final_dataset_filtered based on its "new" index in the dataset
            movie_idx = final_dataset_filtered.iloc[val[0]]['movieId']

            # find the title from the original 'movies' dataset using the original movie id we found above
            # recommend_frame.append({'Title':movies[movies['movieId']==movie_idx]['title'].values[0],'Distance':"{:.3f}".format(val[1])})

            # dictionary
            title = movies[movies['movieId'] == movie_idx]['title'].values[0]
            distance = "{:.3f}".format(val[1])

            recommend_frame_dict[title] = distance

        # df = pd.DataFrame(recommend_frame,index=range(1,n_movies_to_reccomend+1))
        return recommend_frame_dict

    else:
        return "No movies found. Please check your input"

# testing out the function
# print(get_movie_recommendation('hhhhh'))
# print(get_movie_recommendation('Logan'))







