import { useState } from "react";
import { useNavigate } from "react-router-dom";

import praniaLogo from "../assets/prania-besnike.png";
import ashkLogo from "../assets/logo.png";

function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

const handleSubmit = async (e) => {
  e.preventDefault();

  setError("");

  if (!username.trim() || !password.trim()) {
    setError("Ju lutem plotësoni username dhe fjalëkalimin.");
    return;
  }

  try {
    setLoading(true);

    const response = await fetch(
      "http://localhost:3000/api/auth/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username.trim(),
          password: password,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(
        data.message || "Username ose fjalëkalim i pasaktë."
      );
    }

    localStorage.setItem("token", data.token);

    localStorage.setItem(
      "user",
      JSON.stringify(data.user)
    );

    navigate("/dashboard", {
      replace: true,
    });
  } catch (err) {
    console.error("Login error:", err);

    setError(
      err.message ||
        "Ndodhi një gabim gjatë hyrjes në sistem."
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-[#f4f7f4] flex items-center justify-center p-4 md:p-6">

      {/* =====================================================
          LOGIN CARD
      ===================================================== */}

      <div
        className="
          w-full
          max-w-5xl
          min-h-[620px]
          bg-white
          rounded-[28px]
          shadow-[0_25px_70px_rgba(15,23,42,0.14)]
          overflow-hidden
          grid
          md:grid-cols-2
        "
      >

        {/* ===================================================
            PANELI MAJTAS
        =================================================== */}

        <div
          className="
            relative
            bg-[#e8f0e7]
            p-8
            md:p-12
            flex
            flex-col
            items-center
            justify-center
            overflow-hidden
          "
        >

          {/* =================================================
              ASHK LOGO
          ================================================= */}

          <div className="absolute top-7 left-7 z-20">
            <img
              src={ashkLogo}
              alt="ASHK"
              className="
                w-[100px]
                h-[100px]
                object-contain
                drop-shadow-sm
              "
            />
          </div>


          {/* =================================================
              DECORATIVE CIRCLES
          ================================================= */}

          <div
            className="
              absolute
              w-[440px]
              h-[440px]
              rounded-full
              border
              border-white/70
            "
          />

          <div
            className="
              absolute
              w-[340px]
              h-[340px]
              rounded-full
              border
              border-white/70
            "
          />

          <div
            className="
              absolute
              w-[240px]
              h-[240px]
              rounded-full
              border
              border-white/50
            "
          />


          {/* =================================================
              DECORATIVE DOTS
          ================================================= */}

          <div
            className="
              absolute
              top-[22%]
              right-[18%]
              w-2
              h-2
              bg-white/80
              rounded-full
            "
          />

          <div
            className="
              absolute
              bottom-[20%]
              left-[16%]
              w-2
              h-2
              bg-white/70
              rounded-full
            "
          />

          <div
            className="
              absolute
              top-[38%]
              left-[12%]
              w-1.5
              h-1.5
              bg-white/80
              rounded-full
            "
          />


          {/* =================================================
              PRANIA BESNIKE LOGO
          ================================================= */}

          <div
            className="
              relative
              z-10
              w-full
              max-w-[350px]
              flex
              justify-center
              items-center
            "
          >
            <img
              src={praniaLogo}
              alt="Prania Besnike"
              className="
                w-full
                max-h-[150px]
                object-contain
              "
            />
          </div>


          {/* =================================================
              DESCRIPTION
          ================================================= */}

          <div className="relative z-10 text-center mt-7">

            <h1 className="text-3xl font-bold text-slate-900">
              Prania Besnike
            </h1>

            <p
              className="
                text-slate-600
                mt-3
                max-w-sm
                leading-relaxed
              "
            >
              Platforma për administrimin dhe ndjekjen
              <br />
              e ankesave të qytetarëve.
            </p>


            {/* MOTTO */}

            <div
              className="
                mt-6
                flex
                items-center
                justify-center
                flex-wrap
                gap-2
                text-[11px]
                tracking-[0.20em]
                uppercase
                text-slate-500
              "
            >
              <span>Besim</span>

              <span className="text-red-400">
                •
              </span>

              <span>Empati</span>

              <span className="text-red-400">
                •
              </span>

              <span>Shërbim</span>

              <span className="text-red-400">
                •
              </span>

              <span>Angazhim</span>
            </div>

          </div>

        </div>


        {/* ===================================================
            PANELI DJATHTAS
        =================================================== */}

        <div
          className="
            relative
            p-8
            md:p-14
            flex
            items-center
            bg-white
          "
        >

          <div className="w-full max-w-md mx-auto">

            {/* =================================================
                MOBILE LOGOS
            ================================================= */}

            <div
              className="
                md:hidden
                flex
                justify-center
                items-center
                gap-6
                mb-8
              "
            >
              <img
                src={ashkLogo}
                alt="ASHK"
                className="
                  w-16
                  h-16
                  object-contain
                "
              />

              <img
                src={praniaLogo}
                alt="Prania Besnike"
                className="
                  w-32
                  object-contain
                "
              />
            </div>


            {/* =================================================
                TITLE
            ================================================= */}

            <div className="mb-10">

              <p
                className="
                  text-sm
                  font-bold
                  uppercase
                  tracking-[0.18em]
                  text-slate-400
                "
              >
                Mirë se vini
              </p>

              <h2
                className="
                  text-4xl
                  font-bold
                  text-slate-900
                  mt-2
                "
              >
                Hyr në sistem
              </h2>

              <p className="text-slate-500 mt-3">
                Vendosni kredencialet tuaja për të vazhduar.
              </p>

            </div>


            {/* =================================================
                FORM
            ================================================= */}

            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

              {/* =================================================
                  USERNAME
              ================================================= */}

              <div>

                <label
                  htmlFor="username"
                  className="
                    block
                    text-sm
                    font-semibold
                    text-slate-700
                    mb-2
                  "
                >
                  Username
                </label>


                <div className="relative">

                  {/* USER ICON */}

                  <div
                    className="
                      absolute
                      left-4
                      top-1/2
                      -translate-y-1/2
                      text-slate-400
                      pointer-events-none
                    "
                  >
                    <svg
                      width="19"
                      height="19"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a7.5 7.5 0 0115 0"
                      />
                    </svg>
                  </div>


                  <input
                    id="username"
                    name="username"
                    type="text"
                    value={username}
                    onChange={(e) =>
                      setUsername(e.target.value)
                    }
                    placeholder="Shkruani username"
                    autoComplete="username"
                    disabled={loading}
                    className="
                      w-full
                      h-[54px]

                      pl-12
                      pr-4

                      rounded-xl

                      border
                      border-slate-200

                      bg-slate-50

                      text-slate-800

                      outline-none

                      transition-all
                      duration-200

                      placeholder:text-slate-400

                      focus:bg-white
                      focus:border-slate-400
                      focus:ring-4
                      focus:ring-slate-100

                      disabled:opacity-70
                      disabled:cursor-not-allowed
                    "
                  />

                </div>

              </div>


              {/* =================================================
                  PASSWORD
              ================================================= */}

              <div>

                <label
                  htmlFor="password"
                  className="
                    block
                    text-sm
                    font-semibold
                    text-slate-700
                    mb-2
                  "
                >
                  Fjalëkalimi
                </label>


                <div className="relative">

                  {/* LOCK ICON */}

                  <div
                    className="
                      absolute
                      left-4
                      top-1/2
                      -translate-y-1/2
                      text-slate-400
                      pointer-events-none
                    "
                  >
                    <svg
                      width="19"
                      height="19"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <rect
                        x="5"
                        y="10"
                        width="14"
                        height="10"
                        rx="2"
                      />

                      <path d="M8 10V7a4 4 0 018 0v3" />
                    </svg>
                  </div>


                  <input
                    id="password"
                    name="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    placeholder="Shkruani fjalëkalimin"
                    autoComplete="current-password"
                    disabled={loading}
                    className="
                      w-full
                      h-[54px]

                      pl-12
                      pr-12

                      rounded-xl

                      border
                      border-slate-200

                      bg-slate-50

                      text-slate-800

                      outline-none

                      transition-all
                      duration-200

                      placeholder:text-slate-400

                      focus:bg-white
                      focus:border-slate-400
                      focus:ring-4
                      focus:ring-slate-100

                      disabled:opacity-70
                      disabled:cursor-not-allowed
                    "
                  />


                  {/* =================================================
                      SHOW / HIDE PASSWORD
                  ================================================= */}

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (current) => !current
                      )
                    }
                    disabled={loading}
                    aria-label={
                      showPassword
                        ? "Fshih fjalëkalimin"
                        : "Shfaq fjalëkalimin"
                    }
                    className="
                      absolute
                      right-4
                      top-1/2
                      -translate-y-1/2

                      text-slate-400

                      hover:text-slate-700

                      transition

                      disabled:cursor-not-allowed
                    "
                  >

                    {showPassword ? (

                      /* EYE OPEN */

                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.25 12s3.75-6.75 9.75-6.75S21.75 12 21.75 12 18 18.75 12 18.75 2.25 12 2.25 12z"
                        />

                        <circle
                          cx="12"
                          cy="12"
                          r="2.5"
                        />
                      </svg>

                    ) : (

                      /* EYE CLOSED */

                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3 3l18 18M10.6 10.6a2 2 0 002.8 2.8M9.9 4.4A10.3 10.3 0 0112 4.2c6 0 9.75 7.8 9.75 7.8a15.5 15.5 0 01-2.1 3.1M6.2 6.2C3.7 8.1 2.25 12 2.25 12S6 19.8 12 19.8a9.8 9.8 0 004.2-.95"
                        />
                      </svg>

                    )}

                  </button>

                </div>

              </div>


              {/* =================================================
                  LOGIN BUTTON
              ================================================= */}

              <button
                type="submit"
                disabled={loading}
                className="
                  w-full
                  h-[56px]

                  bg-slate-900
                  hover:bg-slate-800

                  active:scale-[0.99]

                  disabled:bg-slate-700
                  disabled:hover:bg-slate-700
                  disabled:cursor-not-allowed
                  disabled:scale-100

                  text-white

                  rounded-xl

                  font-bold

                  transition-all
                  duration-200

                  shadow-[0_10px_25px_rgba(15,23,42,0.18)]

                  flex
                  items-center
                  justify-center
                  gap-3
                "
              >

                {loading ? (

                  <>
                    {/* =========================================
                        CLASSIC SPINNER
                    ========================================= */}

                    <svg
                      className="animate-spin h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden="true"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="9"
                        stroke="currentColor"
                        strokeWidth="3"
                        className="opacity-25"
                      />

                      <path
                        fill="currentColor"
                        className="opacity-90"
                        d="M12 3a9 9 0 0 1 9 9h-3a6 6 0 0 0-6-6V3z"
                      />
                    </svg>

                    <span>
                      Duke hyrë...
                    </span>
                  </>

                ) : (

                  <>
                    <span>
                      Hyr
                    </span>

                    {/* ARROW */}

                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 12h14M13 6l6 6-6 6"
                      />
                    </svg>
                  </>

                )}

              </button>

            </form>


            {/* =================================================
                FOOTER
            ================================================= */}

            <p
              className="
                text-center
                text-xs
                text-slate-400
                mt-9
              "
            >
              Agjencia Shtetërore e Kadastrës
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;