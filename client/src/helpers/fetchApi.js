const controllers = new Map();

const fetchApi = async (url, options) => {
    const config = options || {};


    const previousController = controllers.get(url);
    if (previousController) {
        previousController.abort();
    }

    const controller = new AbortController();
    controllers.set(url, controller);

    try {
        const response = await fetch(url, { ...config, signal: controller.signal });
        const data = await response;

        return data;
    } catch (error) {
        if (error.name === 'AbortError') {
            console.log(`Request to ${url} was aborted`);
        } else {
            throw error;
        }
    }
};

export {
    fetchApi
}
