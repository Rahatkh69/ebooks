import re
import json
import os
import random
from collections import Counter

def clean_text(text):
    # Remove single letters (except 'a'/'I'), arrows, and fix hyphenated words
    text = re.sub(r'\b[b-zB-Z]\b', '', text)
    text = re.sub(r'[-—]\s*\n', '', text)  # Merge hyphenated words
    text = re.sub(r'[→←↑↓]', '', text)     # Remove arrows
    return text

def get_sentences_with_word(sentences, word, num=3):
    # Match whole word only (case-insensitive)
    matches = [s.strip() for s in sentences if re.search(rf'\b{re.escape(word)}\b', s, re.IGNORECASE)]
    return random.sample(matches, min(num, len(matches))) if matches else []

def process_book(input_path, output_file='words.json'):
    with open(input_path, 'r', encoding='utf-8') as f:
        raw_text = f.read()

    # Store a lowercase version for counting but keep original for sentence extraction
    cleaned_text = clean_text(raw_text.lower())
    words = re.findall(r'\b[a-z]+\b', cleaned_text)
    word_counts = Counter(words)

    # Sort by frequency (descending)
    all_unique_words = sorted(word_counts.items(), key=lambda item: item[1], reverse=True)

    # Split original text into sentences for "booklines"
    sentences = re.split(r'(?<=[.!?])\s+', raw_text.strip())

    output_data = []
    for idx, (word, freq) in enumerate(all_unique_words, 1):
        booklines = get_sentences_with_word(sentences, word, num=3)
        entry = {
            "id": idx,
            "word": word,
            "frequency": freq,
            "definition": "",
            "bangla": [],
            "example": "",
            "booklines": booklines
        }
        output_data.append(entry)

    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(output_data, f, ensure_ascii=False, indent=4)

    print(f'Generated {output_file} with {len(all_unique_words)} unique words.')

# Example usage
process_book('book.txt')
