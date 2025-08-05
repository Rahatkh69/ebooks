import json

def process_word_file(filename="2.json"):
    """
    Reads a JSON file, extracts the list of words, and prints each word's
    details on a single line to the console.

    Args:
        filename (str): The name of the JSON file to process.
    """
    try:
        with open(filename, 'r') as file:
            # Load the JSON data from the file
            data = json.load(file)
            
            # Check if the 'words' key exists and is a list
            if 'words' in data and isinstance(data['words'], list):
                # Iterate through each word dictionary in the list
                for word_entry in data['words']:
                    # Format the word details into a single string
                    # The f-string ensures all data is on one line.
                    formatted_line = (
                        f"Word: {word_entry.get('word', 'N/A')}, "
                        f"ID: {word_entry.get('id', 'N/A')}, "
                        f"Wordset ID: {word_entry.get('wordset_id', 'N/A')}, "
                        f"Frequency: {word_entry.get('frequency', 'N/A')}, "
                        f"Definition: '{word_entry.get('definition', 'N/A')}', "
                        f"Bangla: '{word_entry.get('bangla', 'N/A')}', "
                        f"Example: '{word_entry.get('example', 'N/A')}'"
                    )
                    # Print the single formatted line
                    print(formatted_line)
            else:
                print(f"Error: The file '{filename}' does not contain a 'words' list.")

    except FileNotFoundError:
        print(f"Error: The file '{filename}' was not found.")
    except json.JSONDecodeError:
        print(f"Error: Could not decode JSON from the file '{filename}'. Please check the file format.")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")

# Run the function to process the file
if __name__ == "__main__":
    process_word_file()
