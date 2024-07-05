
import { Button } from '@/components/ui/button'
import Link from 'next/link';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '../ui/dropdown-menu';

const Header = () => {
  return (
    <nav className="relative max-w-7xl w-full flex md:grid md:grid-cols-12 items-center justify-between px-4 md:px-8 mx-auto py-7">
      <div className='md:col-span-3'>
        <Link href={'/'}>
          <h1 className="text-2xl font-semibold cursor-pointer">Meal<span className='text-primary'>ify.</span></h1>
        </Link>
      </div>
      <div className='md:col-span-9 flex justify-end'>
        <div className='mr-4'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='default'>Sign In</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuItem asChild>
                <Link href='/admin/sign-in'>
                  <DropdownMenuLabel className='p-0'>Restaurante</DropdownMenuLabel>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href='/user/sign-in'>
                  <DropdownMenuLabel className='p-0'>Cliente</DropdownMenuLabel>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href='/admin/sign-in'>
                  <DropdownMenuLabel className='p-0'>Repartidor</DropdownMenuLabel>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}

export default Header;