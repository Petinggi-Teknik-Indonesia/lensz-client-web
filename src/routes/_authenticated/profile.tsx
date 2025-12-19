import { createFileRoute, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute ('/_authenticated/profile')({
  component: RouteComponent,
})

function RouteComponent(){
    const navigate = useNavigate();
    return(
        <>
        <div className="flex flex-col justify-center">
            <div className=" flex flex-col items-center mb-10">
                <h1>Welcome Back, Optik Gembira!</h1>
            </div>
            <div className="flex flex-row">
                <img src="/logo-color.png" className="w-50 px-4"/>
                <div className="flex flex-col gap-8">
                    <div>
                        <h1>Name:</h1> 
                        <p> Optik Gembira</p>
                    </div>
                    <div>
                        <h1 >Email:</h1> 
                        <p>example@gmail.com</p>
                    </div>
                </div>
            </div>
            <div className="flex flex-row justify-center items-center gap-10 mt-12">
                <button className="bg-primary px-4 py-2 rounded-md text-white hover:bg-accent hover:text-black hover:cursor-pointer"
                                onClick={() => navigate({to: "/scanners"})}>
                    Scanners
                </button>

                <button className="bg-primary px-4 py-2 rounded-md text-white hover:bg-accent hover:text-black hover:cursor-pointer"
                                onClick={() => navigate({to: "/organization"})}>
                    Organizations
                </button>
            </div>
        </div>
        </>

    );
}
