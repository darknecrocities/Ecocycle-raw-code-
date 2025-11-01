import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile, useGetMyEcoCoinBalance } from '../hooks/useQueries';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { LogOut, Moon, Sun, Menu, Settings } from 'lucide-react';
import { useTheme } from 'next-themes';
import type { PageView } from '../App';

interface HeaderProps {
  currentPage: PageView;
  onNavigate: (page: PageView) => void;
}

export default function Header({ currentPage, onNavigate }: HeaderProps) {
  const { clear, identity, loginStatus } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: ecoCoinBalance } = useGetMyEcoCoinBalance();
  const queryClient = useQueryClient();
  const { theme, setTheme } = useTheme();

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const navItems = [
    { id: 'dashboard' as PageView, label: 'Dashboard' },
    { id: 'log' as PageView, label: 'Log Waste' },
    { id: 'analytics' as PageView, label: 'Analytics' },
    { id: 'achievements' as PageView, label: 'Achievements' },
    { id: 'education' as PageView, label: 'Learn' },
    { id: 'redemption' as PageView, label: 'Redeem' },
    { id: 'leaderboard' as PageView, label: 'Leaderboard' },
  ];

  const isLoggingOut = loginStatus === 'logging-in';

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('dashboard')}>
            <img src="/assets/generated/ecocycle-logo-transparent.dim_200x200.png" alt="EcoCycle" className="h-10 w-10" />
            <div>
              <h1 className="text-xl font-bold text-primary">EcoCycle</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">Waste Management & Rewards</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map(item => (
              <Button
                key={item.id}
                variant={currentPage === item.id ? 'default' : 'ghost'}
                onClick={() => onNavigate(item.id)}
                className="font-medium"
                size="sm"
              >
                {item.label}
              </Button>
            ))}
          </nav>

          {/* User Menu */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* EcoCoin Balance */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
              <img src="/assets/generated/ecocoin-token-transparent.dim_100x100.png" alt="EcoCoin" className="h-5 w-5" />
              <span className="font-bold text-primary text-sm">{Number(ecoCoinBalance || 0)}</span>
            </div>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="hidden sm:flex"
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>

            {/* User Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full" disabled={isLoggingOut}>
                  <Avatar>
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {userProfile ? getInitials(userProfile.name) : 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{userProfile?.name || 'User'}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {identity?.getPrincipal().toString().slice(0, 20)}...
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="sm:hidden">
                  <img src="/assets/generated/ecocoin-token-transparent.dim_100x100.png" alt="EcoCoin" className="h-4 w-4 mr-2" />
                  <span>{Number(ecoCoinBalance || 0)} EcoCoins</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="sm:hidden" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
                  {theme === 'dark' ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
                  <span>Toggle theme</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="sm:hidden" />
                <DropdownMenuItem onClick={() => onNavigate('settings')}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} disabled={isLoggingOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>{isLoggingOut ? 'Logging out...' : 'Log out'}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <nav className="flex flex-col gap-2 mt-8">
                  {navItems.map(item => (
                    <Button
                      key={item.id}
                      variant={currentPage === item.id ? 'default' : 'ghost'}
                      onClick={() => onNavigate(item.id)}
                      className="justify-start"
                    >
                      {item.label}
                    </Button>
                  ))}
                  <DropdownMenuSeparator />
                  <Button
                    variant={currentPage === 'settings' ? 'default' : 'ghost'}
                    onClick={() => onNavigate('settings')}
                    className="justify-start"
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
