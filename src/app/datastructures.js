export class Graph {
    constructor(){
        this._graph = {};
    };

    addVertex(index){
        this._graph[index] = [];
    };

    addEdge(index1, index2){
        this._graph[index1].push(index2);
    };

    iteratorBFS(index, stopCondition){
        let result = [];
        let queue = [];
        let visited = [];

        queue.push(index);
        visited.push(index);

        this._iteratorBFSRecursion(result, queue, visited, stopCondition);

        return result;
    };

    _iteratorBFSRecursion(result, queue, visited, stopCondition){
        if(queue.length === 0)
            return;

        let current = queue.shift();
        let neighbors = this._graph[current];

        result.push(current);

        if(stopCondition !== undefined && stopCondition(current))
            return;

        if(neighbors === undefined)
            return;

        for(let i = 0; i < neighbors.length; i++){
            let neighbor = neighbors[i];

            if(!visited.includes(neighbor)){
                queue.push(neighbor);
                visited.push(neighbor);
            }
        }

        this._iteratorBFSRecursion(result, queue, visited, stopCondition);
    };

    iteratorShortestPath(index1, index2){
        let result = [];
        let queue = [];
        let visited = [];
        let pathLength = {};
        let antecessor = {};

        queue.push(index1);
        visited.push(index1);
        pathLength[index1] = 0;
        antecessor[index1] = -1;

        this._iteratorShortestPathRecursion(queue, visited, pathLength, antecessor, index2);

        if(antecessor[index2] !== undefined){
            let currentIndex = index2;
            while(currentIndex !== -1){
                result.unshift(currentIndex);
                currentIndex = antecessor[currentIndex];
            }
        }

        return result;
    };

    _iteratorShortestPathRecursion(queue, visited, pathLength, antecessor, target){
        if(queue.length <= 0)
            return;

        let current = queue.shift();
        let neighbors = this._graph[current];

        if(neighbors === undefined)
            return;

        for(let i = 0; i < neighbors.length; i++){
            let neighbor = neighbors[i];

            if(!visited.includes(neighbor)){
                queue.push(neighbor);
                visited.push(neighbor);

                let oldCost = pathLength[neighbor];
                let newCost = pathLength[current] + 1;

                if(oldCost === undefined || newCost < oldCost){
                    pathLength[neighbor] = newCost;
                    antecessor[neighbor] = current;
                }

                if(neighbor === target)
                    return;
            }
        }

        this._iteratorShortestPathRecursion(queue, visited, pathLength, antecessor, target);
    };
};