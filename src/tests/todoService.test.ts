import { TodoService } from '../todoService';

describe('TodoService', () => {
    let mockPropertiesGet: jest.Mock;
    let mockPropertiesSet: jest.Mock;
    let mockCacheGet: jest.Mock;
    let mockCachePut: jest.Mock;

    beforeEach(() => {
        // Mock PropertiesService
        mockPropertiesGet = jest.fn();
        mockPropertiesSet = jest.fn();
        global.PropertiesService = {
            getUserProperties: () => ({
                getProperty: mockPropertiesGet,
                setProperty: mockPropertiesSet,
            }),
        } as any;

        // Mock CacheService
        mockCacheGet = jest.fn();
        mockCachePut = jest.fn();
        global.CacheService = {
            getUserCache: () => ({
                get: mockCacheGet,
                put: mockCachePut,
            }),
        } as any;

        // Mock Utilities
        global.Utilities = {
            getUuid: () => 'test-uuid-1234',
        } as any;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('getTodos should return empty array when no data exists', () => {
        mockCacheGet.mockReturnValue(null);
        mockPropertiesGet.mockReturnValue(null);

        const todos = TodoService.getTodos();

        expect(todos).toEqual([]);
        expect(mockCacheGet).toHaveBeenCalledWith('todo_app_data');
        expect(mockPropertiesGet).toHaveBeenCalledWith('todo_app_data');
    });

    test('getTodos should return data from cache and skip properties', () => {
        const cachedTodos = [{ id: '1', title: 'Cached Todo', completed: false, createdAt: 1000 }];
        mockCacheGet.mockReturnValue(JSON.stringify(cachedTodos));

        const todos = TodoService.getTodos();

        expect(todos).toEqual(cachedTodos);
        expect(mockCacheGet).toHaveBeenCalledWith('todo_app_data');
        expect(mockPropertiesGet).not.toHaveBeenCalled(); // Should not fall back
    });

    test('getTodos should fall back to properties and update cache if cache is empty', () => {
        const propsTodos = [{ id: '2', title: 'Props Todo', completed: true, createdAt: 2000 }];
        mockCacheGet.mockReturnValue(null);
        mockPropertiesGet.mockReturnValue(JSON.stringify(propsTodos));

        const todos = TodoService.getTodos();

        expect(todos).toEqual(propsTodos);
        expect(mockCacheGet).toHaveBeenCalledWith('todo_app_data');
        expect(mockPropertiesGet).toHaveBeenCalledWith('todo_app_data');
        expect(mockCachePut).toHaveBeenCalledWith('todo_app_data', JSON.stringify(propsTodos), 21600);
    });

    test('saveTodos should update both properties and cache', () => {
        const newTodos = [{ id: '3', title: 'New Todo', completed: false, createdAt: 3000 }];

        TodoService.saveTodos(newTodos);

        const expectedDataStr = JSON.stringify(newTodos);
        expect(mockPropertiesSet).toHaveBeenCalledWith('todo_app_data', expectedDataStr);
        expect(mockCachePut).toHaveBeenCalledWith('todo_app_data', expectedDataStr, 21600);
    });
});
