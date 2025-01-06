import type { Demo } from '@/types';

export const ProductService = {
    getProductsSmall() {
        return fetch('/demo/data/products-small.json', {
            headers: { 'Cache-Control': 'no-cache' }
        })
            .then((res) => res.json())
            .then((d) => d.data as Demo.Product[]);
    },

    getProducts() {
        return fetch('/demo/data/products.json', {
            headers: { 'Cache-Control': 'no-cache' }
        })
            .then((res) => res.json())
            .then((d) => d.data as Demo.Product[]);
    },

    getProductsMixed() {
        return fetch('/demo/data/products-mixed.json', {
            headers: { 'Cache-Control': 'no-cache' }
        })
            .then((res) => res.json())
            .then((d) => d.data as Demo.Product[]);
    },

    getProductsWithOrdersSmall() {
        return fetch('/demo/data/products-orders-small.json', {
            headers: { 'Cache-Control': 'no-cache' }
        })
            .then((res) => res.json())
            .then((d) => d.data as Demo.Product[]);
    },

    getProductsWithOrdersLarge() {
        return fetch('/demo/data/products-orders.json', {
            headers: { 'Cache-Control': 'no-cache' }
        })
            .then((res) => res.json())
            .then((d) => d.data as Demo.Product[]);
    }
};

export const AwerenessService = {
    getAwereness() {
        return fetch('/demo/data/awereness.json', {
            headers: { 'Cache-Control': 'no-cache' }
        })
            .then((res) => res.json())
            .then((d) => d.data as Demo.Awereness[]);
    },
}


export const CampaignService  = {
    getCampaign () {
        return fetch('/demo/data/campaign.json', {
            headers: { 'Cache-Control': 'no-cache' }
        })
            .then((res) => res.json())
            .then((d) => d.data as Demo.Campaign[]);
    },
}

export const NotificationTemplateService  = {
    getNotificationTemplates () {
        return fetch('/demo/data/notification-templates.json', {
            headers: { 'Cache-Control': 'no-cache' }
        })
            .then((res) => res.json())
            .then((d) => d.data as Demo.NotificationTemplate[]);
    },
    getPolicyNotificationTemplates () {
        return fetch('/demo/data/policy-notification-templates.json', {
            headers: { 'Cache-Control': 'no-cache' }
        })
            .then((res) => res.json())
            .then((d) => d.data as Demo.NotificationTemplate[]);
    },
}

export const UserService  = {
    getUsers () {
        return fetch('http://localhost:3001/v1/user', {
            headers: { 'Cache-Control': 'no-cache' }
        })
            .then((res) => res.json())
            .then((d) => d as Demo.Users[]);
    },
    getGroups () {
        return fetch('http://localhost:3001/v1/user/groups', {
            headers: { 'Cache-Control': 'no-cache' }
        })
            .then((res) => res.json())
            .then((d) => d as Demo.Groups[]);
    },
    async createUser(groupData: Partial<Demo.Users>) {
        return fetch('http://localhost:3001/v1/user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache',
            },
            body: JSON.stringify(groupData),
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`Failed to create user: ${res.status} ${res.statusText}`);
                }
                return res.json();
            })
            .then((d) => d as Demo.Users);
    },   
    async deleteUser(groupData:{email:string}) {
        return fetch(`http://localhost:3001/v1/user`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache',
            },
            body: JSON.stringify(groupData),
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`Failed to delete user: ${res.status} ${res.statusText}`);
                }
                return res.json(); // Adjust this based on the server response
            }).then((d) => d as Demo.Users);
    },
   async createGroup(groupData: { name: string; }) {
        return fetch('http://localhost:3001/v1/user/groups', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache',
            },
            body: JSON.stringify(groupData),
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`Failed to create group: ${res.status} ${res.statusText}`);
                }
                return res.json();
            })
            .then((d) => d as Demo.Groups);
    },    
    updatUserGroup( updatedData: Partial<Demo.Groups>) {
        return fetch(`http://localhost:3001/v1/user/groups`, {
            method: 'PATCH', // Use PUT if you want to replace the entire group object
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache',
            },
            body: JSON.stringify(updatedData),
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`Failed to update group: ${res.statusText}`);
                }
                return res.json();
            })
            .then((d) => d as Demo.Groups);
    }
,    

deleteGroup(groupData:{id:string}) {
    return fetch(`http://localhost:3001/v1/user/groups`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache',
        },
        body: JSON.stringify(groupData),
    })
        .then((res) => {
            if (!res.ok) {
                throw new Error(`Failed to delete group: ${res.status} ${res.statusText}`);
            }
            return res.json(); // Adjust this based on the server response
        }).then((d) => d as Demo.Groups);
}
,


    getRoles () {
        return fetch('/demo/data/roles.json', {
            headers: { 'Cache-Control': 'no-cache' }
        })
            .then((res) => res.json())
            .then((d) => d.data as Demo.Roles[]);
    },
}


export const PolicyService  = {
    getPolicy () {
        return fetch('/demo/data/policy.json', {
            headers: { 'Cache-Control': 'no-cache' }
        })
            .then((res) => res.json())
            .then((d) => d.data as Demo.Policy[]);
    },
}

export const FrameworkService  = {
    getFramework () {
        return fetch('/demo/data/framework.json', {
            headers: { 'Cache-Control': 'no-cache' }
        })
            .then((res) => res.json())
            .then((d) => d.data as Demo.Framework[]);
    },
}

export const ControlService  = {
    getControl () {
        return fetch('/demo/data/control.json', {
            headers: { 'Cache-Control': 'no-cache' }
        })
            .then((res) => res.json())
            .then((d) => d.data as Demo.Control[]);
    },
}