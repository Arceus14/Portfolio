import csv
import sys

from util import Node, StackFrontier, QueueFrontier

# Maps names to a set of corresponding person_ids
names = {}

# Maps person_ids to a dictionary of: name, birth, movies (a set of movie_ids)
people = {}

# Maps movie_ids to a dictionary of: title, year, stars (a set of person_ids)
movies = {}


def load_data(directory):
    """
    Load data from CSV files into memory.
    """
    # Load people
    with open(f"{directory}/people.csv", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            people[row["id"]] = {
                "name": row["name"],
                "birth": row["birth"],
                "movies": set()
            }
            if row["name"].lower() not in names:
                names[row["name"].lower()] = {row["id"]}
            else:
                names[row["name"].lower()].add(row["id"])

    # Load movies
    with open(f"{directory}/movies.csv", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            movies[row["id"]] = {
                "title": row["title"],
                "year": row["year"],
                "stars": set()
            }

    # Load stars
    with open(f"{directory}/stars.csv", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            try:
                people[row["person_id"]]["movies"].add(row["movie_id"])
                movies[row["movie_id"]]["stars"].add(row["person_id"])
            except KeyError:
                pass


def main():
    if len(sys.argv) > 2:
        sys.exit("Usage: python degrees.py [directory]")
    directory = sys.argv[1] if len(sys.argv) == 2 else "large"

    # Load data from files into memory
    print("Loading data...")
    load_data(directory)
    print("Data loaded.")

    source = person_id_for_name(input("Name: "))
    if source is None:
        sys.exit("Person not found.")
    target = person_id_for_name(input("Name: "))
    if target is None:
        sys.exit("Person not found.")

    path = shortest_path(source, target)

    if path is None:
        print("Not connected.")
    else:
        degrees = len(path)
        print(f"{degrees} degrees of separation.")
        path = [(None, source)] + path
        for i in range(degrees):
            person1 = people[path[i][1]]["name"]
            person2 = people[path[i + 1][1]]["name"]
            movie = movies[path[i + 1][0]]["title"]
            print(f"{i + 1}: {person1} and {person2} starred in {movie}")
    """
    Returns the shortest list of (movie_id, person_id) pairs
    that connect the source to the target.
         
    If no possible path, returns None.
    """
    

queue = QueueFrontier()
visited = set()

def shortest_path(source, target):
    
    count = 0
    first = True
    while (not queue.empty() or first):
        print(count)
        count += 1
        if first:
            lst = add_neighbors_to_queue(source, source, target)
            if type(lst) == list:
                return lst
            first = False
        node = queue.remove()
        # if node.state == target:
        #     print("Path found by syed")
        #     return generate_path(node.action, source, node.state, node.parent)
        #     # print("Visited nodes: ")
            # for step in visited:
            #     print(f"{step.state}, {step.parent}, {step.action}")
            
        if node not in visited:
            visited.add(node)
            lst = add_neighbors_to_queue(node.state, source, target)
            if type(lst) == list:
                return lst

def add_neighbors_to_queue(sub_source, source, target):
    for each in neighbors_for_person(sub_source):
        #ensuring no self loops
        neighbor = each[1]
        movie = each[0]
        if neighbor not in  [sub_source, source] and queue.contains_state(neighbor) == False and not_visited(neighbor):
            node = Node(neighbor, sub_source, movie)
            if neighbor == target:
                visited.add(node)
                return generate_path(source, target, node)

            queue.add(node)

def not_visited(neighbor):
    return not any(node.state==neighbor for node in visited)

rev_path = []
pc = 0
def generate_path(source, target, node):
    rev_path.append((node.action, node.state))
    if node.parent == source:
        rev_path.reverse()
        return rev_path
    global pc
    pc += 1
    return generate_path(
        source,
        target, 
        get_parent(node)
    )

def get_parent(node):
    for each in visited:
        if each.state == node.parent:
            return each
    
    # print("Path TODO")


    # print('no path found by syed')
        
    # # TODO
    # print("Neighbors of source")
    # print(neighbors_for_person(source))
    # print("Neighbors of target")
    # print(neighbors_for_person(target))




    
def person_id_for_name(name):
    """
    Returns the IMDB id for a person's name,
    resolving ambiguities as needed.
    """
    person_ids = list(names.get(name.lower(), set()))
    if len(person_ids) == 0:
        return None
    elif len(person_ids) > 1:
        print(f"Which '{name}'?")
        for person_id in person_ids:
            person = people[person_id]
            name = person["name"]
            birth = person["birth"]
            print(f"ID: {person_id}, Name: {name}, Birth: {birth}")
        try:
            person_id = input("Intended Person ID: ")
            if person_id in person_ids:
                return person_id
        except ValueError:
            pass
        return None
    else:
        return person_ids[0]


def neighbors_for_person(person_id):
    """
    Returns (movie_id, person_id) pairs for people
    who starred with a given person.
    """
    movie_ids = people[person_id]["movies"]
    neighbors = set()
    for movie_id in movie_ids:
        for person_id in movies[movie_id]["stars"]:
            neighbors.add((movie_id, person_id))
    return neighbors


if __name__ == "__main__":
    main()
