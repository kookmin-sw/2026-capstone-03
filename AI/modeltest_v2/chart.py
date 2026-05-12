import pandas as pd
import matplotlib.pyplot as plt

# =========================
# Your experiment results
# =========================
df = pd.DataFrame({
    "Model": ["ResNet56", "CLIP", "DINOv2", "WRN-28-10"],
    "Sejong vs Lee1": [0.7661, 0.7618, 0.3478, 0.6535],
    "Sejong vs Lee2": [0.7173, 0.7880, 0.4076, 0.5748],
    "Sejong vs Stephen": [0.7693, 0.7723, 0.3891, 0.6646],
    "Lee2 vs Stephen" : [0.7833, 0.8245, 0.7312, 0.6635]
})

def unicode_underline(text):
    """Adds a unicode combining underline to each character."""
    return "".join([char + '\u0332' for char in text])

# =========================
# Create paper-style table
# =========================
fig, ax = plt.subplots(figsize=(10, 3))
ax.axis('off')

# Build table
table = ax.table(
    cellText=df.values,
    colLabels=df.columns,
    cellLoc='center',
    loc='center'
)

# =========================
# Styling
# =========================
table.auto_set_font_size(False)
table.set_fontsize(12)
table.scale(1.2, 2.0)

n_rows = len(df)
n_cols = len(df.columns)

# Header styling
for col in range(n_cols):
    cell = table[(0, col)]
    cell.get_text().set_weight('bold')
    cell.set_linewidth(1.5)

# =========================
# Bold Min / Underline 2nd Min
# =========================
for col_idx in range(1, n_cols):
    # Get numeric values for comparison
    values = pd.to_numeric(df.iloc[:, col_idx])

    # Get indices of sorted values (ascending)
    sorted_indices = values.argsort().values

    best_row_idx = sorted_indices[0] + 1  # +1 for header
    second_best_row_idx = sorted_indices[1] + 1

    for row_idx in range(1, n_rows + 1):
        cell = table[(row_idx, col_idx)]
        val_str = f"{values.iloc[row_idx-1]:.2f}"

        if row_idx == best_row_idx:
            # Bold the minimum
            cell.get_text().set_text(val_str)
            cell.get_text().set_weight('bold')

        elif row_idx == second_best_row_idx:
            # Underline the second minimum using Unicode
            underlined_val = unicode_underline(val_str)
            cell.get_text().set_text(underlined_val)

        else:
            # Regular formatting for others
            cell.get_text().set_text(val_str)

# =========================
# Final Polish
# =========================
for (row, col), cell in table.get_celld().items():
    cell.set_edgecolor('black')
    cell.set_linewidth(0.7)

    # Thicker borders for top and bottom of table
    if row == 0 or row == n_rows:
        cell.set_linewidth(1.5)

plt.tight_layout()
plt.savefig("./iclr_style_table.pdf", bbox_inches='tight', dpi=300)
plt.show()
