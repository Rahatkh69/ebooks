from datetime import datetime, timedelta
import calendar
import matplotlib.pyplot as plt
import os

# Define each sprint with its duration and name
sprints = [
    {"name": "3-Day Core Voice Blitz", "days": 3},
    {"name": "7-Day Influence Weave", "days": 7},
    {"name": "5-Day Presence Projection", "days": 5},
    {"name": "10-Day Signature Soul", "days": 10},
    {"name": "4-Day Silence Strike", "days": 4},
    {"name": "6-Day Emotional Hijack", "days": 6},
    {"name": "3-Day Verbal Warfare", "days": 3},
    {"name": "7-Day Tonal Switch Mastery", "days": 7},
    {"name": "4-Day Ice Pressure Test", "days": 4}
]

# Starting date (customizable)
start_date = datetime(2025, 6, 28)
sprint_blocks = []
current_date = start_date

# Assign sprint ranges
for sprint in sprints:
    end_date = current_date + timedelta(days=sprint["days"] - 1)
    sprint_blocks.append((current_date, end_date, sprint["name"]))
    current_date = end_date + timedelta(days=1)

# Create a map for June-July-August 2025 calendar visualization
calendar_data = {}
for date_start, date_end, name in sprint_blocks:
    day = date_start
    while day <= date_end:
        calendar_data[day] = name
        day += timedelta(days=1)

# Bold hex colors for each sprint — no weak sauce
colors_list = [
    "#e63946",  # intense red
    "#f4a261",  # warm orange
    "#2a9d8f",  # teal green
    "#264653",  # dark slate blue
    "#e9c46a",  # mustard yellow
    "#f72585",  # hot pink
    "#3a0ca3",  # deep blue
    "#4361ee",  # vivid blue
    "#720026"   # dark red
]

colors = colors_list[:len(sprints)]
color_map = {s["name"]: colors[i] for i, s in enumerate(sprints)}

# Plotting calendar heatmap for June, July, and August 2025
fig, ax = plt.subplots(figsize=(14, 5))  # smaller height to cut space

months = [6, 7, 8]
month_row_map = {6: 2, 7: 1, 8: 0}  # rows from top to bottom

block_height = 0.6  # smaller height than 1
block_width = 1

for month in months:
    _, days_in_month = calendar.monthrange(2025, month)
    for day in range(1, days_in_month + 1):
        date = datetime(2025, month, day)
        sprint_name = calendar_data.get(date)
        row = month_row_map[month]
        col = day - 1
        color = color_map[sprint_name] if sprint_name else "white"
        # Draw rectangle with smaller height
        ax.add_patch(plt.Rectangle((col, row), block_width, block_height, color=color, edgecolor='gray'))
        # Center text vertically and horizontally in the smaller block
        ax.text(col + block_width/2, row + block_height/2, str(day), ha='center', va='center', fontsize=8, color='black')

# Adjust axis limits to fit smaller blocks stacked properly
ax.set_xlim(0, 31)
ax.set_ylim(-0.5, 3)  # leave some margin below bottom row
ax.set_xticks(range(0, 31))
ax.set_yticks([block_height/2 + i for i in range(3)])  # center y-ticks in each row/block
ax.set_yticklabels(["August 2025", "July 2025", "June 2025"])
ax.set_xticklabels([])
ax.set_title("Power Sprint Calendar (June-August 2025)", fontsize=14)

# Legend with colors
legend_elements = [plt.Rectangle((0, 0), 1, 1, color=color_map[name], label=name) for name in color_map]
ax.legend(handles=legend_elements, bbox_to_anchor=(1.05, 1), loc='upper left')

plt.tight_layout()

# Save PDF to parent folder
parent_dir = os.path.abspath(os.path.join(os.getcwd(), os.pardir))
pdf_path = os.path.join(parent_dir, "Power_Sprint_Calendar_Jun_Aug_2025.pdf")
fig.savefig(pdf_path, format='pdf')
print(f"[🔥] Power Sprint Calendar PDF saved at: {pdf_path}")

plt.show()
