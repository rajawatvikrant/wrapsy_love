import { Link } from "@tanstack/react-router";
import { Instagram, Mail, MapPin } from "lucide-react";
import logo from "@/assets/wrapsy-logo.png.asset.json";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-secondary/50">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            {/* <img
              src={logo.url}
              alt="Wrapsy Love logo"
              width={36}
              height={36}
              loading="lazy"
              className="size-9 object-contain"
            /> */}
            <span className="font-script text-xl text-primary">Wrapsy</span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            Where emotions are wrapped with love. Custom and festive hampers for every event,
            handmade in Indore, starting at just ₹599 — shipping PAN India.
          </p>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-foreground">Shop</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/shop" className="hover:text-primary">All hampers</Link></li>
            <li><Link to="/shop" search={{ category: "premium-hampers" }} className="hover:text-primary">Premium edits</Link></li>
            <li><Link to="/shop" search={{ category: "budget-hampers" }} className="hover:text-primary">Under ₹999</Link></li>
            <li><Link to="/build-a-hamper" className="hover:text-primary">Build a hamper</Link></li>
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-foreground">Help</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/track-order" className="hover:text-primary">Track your order</Link></li>
            <li><Link to="/account" className="hover:text-primary">Your account</Link></li>
            <li><Link to="/wishlist" className="hover:text-primary">Wishlist</Link></li>
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-foreground">Contact</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2"><MapPin className="size-4" /> Indore, India</li>
            <li className="flex items-center gap-2"><Mail className="size-4" /> care@wrapsy.love</li>
            <li>
              <a
                href="https://instagram.com/wrapsy_love"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 hover:text-primary"
              >
                <Instagram className="size-4" /> @wrapsy_love · DM to order
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Wrapsy Love. All prices in INR, inclusive of GST where applicable.
      </div>
    </footer>
  );
}
