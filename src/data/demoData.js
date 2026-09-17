export const images = {
  bowl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=80",
  sandwich:
    "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=900&q=80",
  juice:
    "https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=900&q=80",
  yogurt:
    "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=900&q=80",
  fruit:
    "https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?auto=format&fit=crop&w=900&q=80",
  cookie:
    "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=900&q=80",
};

export const initialProducts = [
  {
    id: 1,
    name: "Bowl de frutas",
    category: "Frutas",
    description: "Frutas frescas de temporada con granola y miel.",
    price: 6500,
    stock: 12,
    image: images.bowl,
  },
  {
    id: 2,
    name: "Sandwich integral",
    category: "Salados",
    description: "Pan integral, pollo, vegetales frescos y queso.",
    price: 8500,
    stock: 8,
    image: images.sandwich,
  },
  {
    id: 3,
    name: "Jugo natural",
    category: "Bebidas",
    description: "Jugo preparado al momento, sin azúcar añadida.",
    price: 4500,
    stock: 20,
    image: images.juice,
  },
  {
    id: 4,
    name: "Parfait de yogur",
    category: "Desayunos",
    description: "Yogur griego, frutos rojos y avena tostada.",
    price: 7000,
    stock: 6,
    image: images.yogurt,
  },
  {
    id: 5,
    name: "Mix de frutas",
    category: "Frutas",
    description: "Una mezcla práctica de frutas listas para disfrutar.",
    price: 5000,
    stock: 15,
    image: images.fruit,
  },
  {
    id: 6,
    name: "Galletas de avena",
    category: "Snacks",
    description: "Galletas caseras con avena, pasas y chocolate.",
    price: 3500,
    stock: 4,
    image: images.cookie,
  },
];

export const demoUsers = [
  {
    id: 1,
    name: "María González",
    email: "maria@colegio.edu.co",
    password: "maria123",
    role: "buyer",
  },
  {
    id: 2,
    name: "Andrés Rojas",
    email: "andres@colegio.edu.co",
    password: "andres123",
    role: "staff",
  },
];

export const initialOrders = [
  {
    id: "PS-1048",
    customer: "María González",
    status: "en_preparacion",
    payment: "Transferencia",
    paymentStatus: "reportado",
    total: 28000,
    date: "Hoy, 10:12",
    items: "2 productos",
  },
  {
    id: "PS-1047",
    customer: "Carlos Ramírez",
    status: "pendiente",
    payment: "Efectivo",
    paymentStatus: "pendiente",
    total: 13000,
    date: "Hoy, 09:45",
    items: "2 productos",
  },
  {
    id: "PS-1046",
    customer: "Laura Torres",
    status: "listo",
    payment: "Efectivo",
    paymentStatus: "pendiente",
    total: 19500,
    date: "Ayer, 13:20",
    items: "3 productos",
  },
];

export const notifications = [
  { id: 1, title: "Nuevo pedido recibido", detail: "Hace 8 minutos · PS-1048" },
  {
    id: 2,
    title: "Producto con bajo stock",
    detail: "Galletas de avena · 4 disponibles",
  },
  { id: 3, title: "Pago reportado", detail: "María González · PS-1048" },
];
