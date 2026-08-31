-- Esquema inicial para Seguridad Avanzada Shop
-- Ejecutar en Supabase: SQL Editor > New Query > Pegar y ejecutar

-- Perfiles extendidos (Supabase Auth crea auth.users; aquí añadimos nombre, teléfono)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nombre TEXT,
  telefono TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Carritos (guest o usuario)
CREATE TABLE IF NOT EXISTS public.carts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  token_guest TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ítems del carrito
CREATE TABLE IF NOT EXISTS public.cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cart_id UUID NOT NULL REFERENCES public.carts(id) ON DELETE CASCADE,
  sku TEXT NOT NULL,
  descripcion TEXT,
  imagen TEXT,
  cantidad INT NOT NULL DEFAULT 1,
  precio_mxn NUMERIC(12,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(cart_id, sku)
);

-- Pedidos
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  email TEXT NOT NULL,
  nombre TEXT NOT NULL,
  telefono TEXT,
  total_mxn NUMERIC(12,2) NOT NULL,
  estado TEXT DEFAULT 'pendiente',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ítems del pedido
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  sku TEXT NOT NULL,
  descripcion TEXT,
  cantidad INT NOT NULL,
  precio_unitario NUMERIC(12,2) NOT NULL,
  subtotal NUMERIC(12,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_carts_user_id ON public.carts(user_id);
CREATE INDEX IF NOT EXISTS idx_carts_token_guest ON public.carts(token_guest);
CREATE INDEX IF NOT EXISTS idx_cart_items_cart_id ON public.cart_items(cart_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);

-- RLS: habilitar políticas básicas (ajustar según necesidades de seguridad)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Políticas: usuarios ven solo sus datos
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING ((select auth.uid()) = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING ((select auth.uid()) = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK ((select auth.uid()) = id);

-- Carts: usuario autenticado gestiona sus carritos; anon puede crear/leer por token_guest
DROP POLICY IF EXISTS "Users can manage own carts" ON public.carts;
CREATE POLICY "Users can manage own carts" ON public.carts
  FOR ALL USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Anyone can create cart" ON public.carts;
CREATE POLICY "Anyone can create cart" ON public.carts
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Anon can read cart by token" ON public.carts;
CREATE POLICY "Anon can read cart by token" ON public.carts
  FOR SELECT USING (token_guest IS NOT NULL);

-- Cart items: permisos amplios para desarrollo (refinar RLS en producción)
DROP POLICY IF EXISTS "Cart items all" ON public.cart_items;
CREATE POLICY "Cart items all" ON public.cart_items
  FOR ALL USING (true);

-- Orders: usuario ve sus pedidos
DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;
CREATE POLICY "Users can view own orders" ON public.orders
  FOR SELECT USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Anyone can create order" ON public.orders;
CREATE POLICY "Anyone can create order" ON public.orders
  FOR INSERT WITH CHECK (true);

-- Order items: quien tenga acceso al order
DROP POLICY IF EXISTS "Order items follow order" ON public.order_items;
CREATE POLICY "Order items follow order" ON public.order_items
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.user_id = (select auth.uid()))
  );

DROP POLICY IF EXISTS "Order items insert on order create" ON public.order_items;
CREATE POLICY "Order items insert on order create" ON public.order_items
  FOR INSERT WITH CHECK (true);

-- Trigger: crear perfil automáticamente al registrarse
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, nombre)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'nombre', NEW.email));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
