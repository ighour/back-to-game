export class Graph {
    constructor(){
        this._g = {};
    };

    addVertex(index){
        this._g[index] = [];
    };

    addEdge(index1, index2){
        this._g[index1].push(index2);
    };

    BFS(index, stopCondition){
        let result = [];
        let queue = [];
        let visited = [];

        queue.push(index);
        visited.push(index);

        this._ib(result, queue, visited, stopCondition);

        return result;
    };

    _ib(result, queue, visited, stopCondition){
        if(queue.length === 0)
            return;

        let current = queue.shift();
        let neighbors = this._g[current];

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

        this._ib(result, queue, visited, stopCondition);
    };

    shortestPath(index1, index2){
        let result = [];
        let queue = [];
        let visited = [];
        let pathLength = {};
        let antecessor = {};

        queue.push(index1);
        visited.push(index1);
        pathLength[index1] = 0;
        antecessor[index1] = -1;

        this._is(queue, visited, pathLength, antecessor, index2);

        if(antecessor[index2] !== undefined){
            let currentIndex = index2;
            while(currentIndex !== -1){
                result.unshift(currentIndex);
                currentIndex = antecessor[currentIndex];
            }
        }

        return result;
    };

    _is(queue, visited, pathLength, antecessor, target){
        if(queue.length <= 0)
            return;

        let current = queue.shift();
        let neighbors = this._g[current];

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

        this._is(queue, visited, pathLength, antecessor, target);
    };
};