import json
from pathlib import Path
from jinja2 import Environment, FileSystemLoader, select_autoescape

BASE_DIR = Path(__file__).resolve().parent.parent
TEMPLATES_DIR = BASE_DIR / "templates"
DATA_DIR = BASE_DIR / "data"

env = Environment(
    loader=FileSystemLoader(TEMPLATES_DIR),
    autoescape=select_autoescape(["html", "xml"])
)

template = env.get_template("index.html")


def load_json(filename: str):
    with open(DATA_DIR / filename, "r", encoding="utf-8") as f:
        return json.load(f)


profile = load_json("profile.json")
experiences = load_json("experience.json")
projects = load_json("projects.json")

html = template.render(
    lang="en",
    profile=profile,
    experiences=experiences,
    projects=projects
)

output_file = BASE_DIR / "index.html"

with open(output_file, "w", encoding="utf-8") as f:
    f.write(html)

print(f"Built {output_file}")