import { useMemo, useState } from 'react'
import LightboxVideo, { toEmbedSrc } from './LightboxVideo'
import Reveal from './Reveal'
import { PROFILE, PRIVATE_REEL } from '../data/profile'
import { FileText, Play } from 'lucide-react'

const LinkedinFilledIcon = ({ className }) => (
  <svg
    role="img"
    viewBox="0 0 16 16"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <title>LinkedIn</title>
    <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854zm4.943 12.248V6.169H2.542v7.225zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4 3.226 2.4 3.934c0 .694.521 1.248 1.327 1.248zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225z" />
  </svg>
)

const ImdbFilledIcon = ({ className }) => (
  <svg
    role="img"
    viewBox="0 0 24 24"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <mask id="imdb-mask">
        <rect width="24" height="24" rx="3.5" fill="white" />
        <path
          d="M4.7954 8.2603v7.3636H2.8899V8.2603h1.9055zm6.5367 0v7.3636H9.6707v-4.9704l-.6711 4.9704H7.813l-.6986-4.8618-.0066 4.8618h-1.668V8.2603h2.468c.0748.4476.1492.9694.2307 1.5734l.2712 1.8713.4407-3.4447h2.4817zm2.9772 1.3289c.0742.0404.122.108.1417.2034.0279.0953.0345.3118.0345.6442v2.8548c0 .4881-.0345.7867-.0955.8954-.0609.1152-.2304.1695-.5018.1695V9.5211c.204 0 .3457.0205.4211.0681zm-.0211 6.0347c.4543 0 .8006-.0265 1.0245-.0742.2304-.0477.4204-.1357.5694-.2648.1556-.1218.2642-.298.3251-.5219.0611-.2238.1021-.6648.1021-1.3224v-2.5832c0-.6986-.0271-1.1668-.0742-1.4039-.041-.237-.1431-.4543-.3126-.6437-.1695-.1973-.4198-.3324-.7456-.421-.3191-.0808-.8542-.1285-1.7694-.1285h-1.4244v7.3636h2.3051zm5.14-1.7827c0 .3523-.0199.5762-.0544.6708-.033.0947-.1894.1424-.3046.1424-.1086 0-.19-.0477-.2238-.1351-.041-.0887-.0609-.2986-.0609-.6238v-1.9469c0-.3324.0199-.5423.0543-.6237.0338-.0808.1086-.122.2171-.122.1153 0 .2709.0412.3114.1425.041.0947.0609.2986.0609.6032v1.8926zm-2.4747-5.5809v7.3636h1.7157l.1152-.4675c.1556.1894.3251.3324.5152.4271.1828.0881.4608.1357.678.1357.3047 0 .5629-.0748.7802-.237.2165-.1562.3589-.3462.4198-.5628.0543-.2173.0887-.543.0887-.9841v-2.0675c0-.4409-.0139-.7324-.0344-.8681-.0199-.1357-.0742-.2781-.1695-.4204-.1021-.1425-.2437-.251-.4272-.3325-.1834-.0742-.3999-.1152-.6576-.1152-.2172 0-.4952.0477-.6846.1285-.1835.0887-.353.2238-.5086.4007V8.2603h-1.8309z"
          fill="black"
        />
      </mask>
    </defs>
    <rect
      width="24"
      height="24"
      rx="3.5"
      fill="currentColor"
      mask="url(#imdb-mask)"
    />
  </svg>
)

export default function About() {
  const SHOW_ICONS = false
  const [reelOpen, setReelOpen] = useState(false)
  const reelUrl = PRIVATE_REEL.url
  const reelSrc = useMemo(() => toEmbedSrc(reelUrl) || reelUrl, [reelUrl])

  const openReel = (e) => {
    e.preventDefault()
    setReelOpen(true)
  }

  const buttonClass = `flex-1 lg:flex-none flex items-center justify-center w-full py-4 border-2 border-[color:var(--neo-border)] bg-background text-xl lg:text-2xl font-medium text-foreground shadow-[4px_4px_0px_0px_var(--neo-shadow)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_var(--neo-shadow)] transition-all active:translate-x-[4px] active:translate-y-[4px] active:shadow-none ${
    SHOW_ICONS ? '' : 'px-8'
  }`

  return (
    <>
      <section id="about" className="py-40 bg-secondary/20">
        <div className="max-w-7xl mx-auto px-4 text-left">
          <Reveal>
            <h2 className="text-6xl lg:text-7xl font-light text-foreground mb-10">About</h2>
          </Reveal>
          <div className="lg:flex lg:items-start lg:gap-24">
            <div className="lg:flex-1">
              {PROFILE.bio.map((paragraph, i) => (
                <Reveal key={i} delay={100 + (i * 50)}>
                  <p className="text-xl text-muted-foreground leading-relaxed mb-8">
                    {paragraph}
                  </p>
                </Reveal>
              ))}
            </div>
            <Reveal delay={250}>
              <div className="mt-12 lg:mt-0 lg:ml-auto w-full max-w-full lg:max-w-sm grid grid-cols-1 md:grid-cols-2 lg:flex lg:flex-col gap-4 lg:gap-5">
                <a
                  href={PROFILE.links.cv}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonClass}
                >
                  {SHOW_ICONS ? (
                    <>
                      <div className="w-14 lg:w-16 flex justify-center items-center flex-shrink-0">
                        <FileText className="w-5 h-5 lg:w-6 lg:h-6" />
                      </div>
                      <span className="flex-1 text-center">CV</span>
                      <div className="w-14 lg:w-16 flex-shrink-0" aria-hidden="true" />
                    </>
                  ) : (
                    <span>CV</span>
                  )}
                </a>
                <a
                  href={PROFILE.links.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonClass}
                >
                  {SHOW_ICONS ? (
                    <>
                      <div className="w-14 lg:w-16 flex justify-center items-center flex-shrink-0">
                        <LinkedinFilledIcon className="w-4 h-4 lg:w-5 lg:h-5" />
                      </div>
                      <span className="flex-1 text-center">LinkedIn</span>
                      <div className="w-14 lg:w-16 flex-shrink-0" aria-hidden="true" />
                    </>
                  ) : (
                    <span>LinkedIn</span>
                  )}
                </a>
                <a
                  href={PROFILE.links.imdb}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonClass}
                >
                  {SHOW_ICONS ? (
                    <>
                      <div className="w-14 lg:w-16 flex justify-center items-center flex-shrink-0">
                        <ImdbFilledIcon className="w-4 h-4 lg:w-5 lg:h-5" />
                      </div>
                      <span className="flex-1 text-center">IMDb</span>
                      <div className="w-14 lg:w-16 flex-shrink-0" aria-hidden="true" />
                    </>
                  ) : (
                    <span>IMDb</span>
                  )}
                </a>
                <a
                  href={reelUrl}
                  onClick={openReel}
                  className={`${buttonClass} cursor-pointer`}
                >
                  {SHOW_ICONS ? (
                    <>
                      <div className="w-14 lg:w-16 flex justify-center items-center flex-shrink-0">
                        <Play className="w-5 h-5 lg:w-6 lg:h-6" strokeWidth={2.8} />
                      </div>
                      <span className="flex-1 text-center">Reel</span>
                      <div className="w-14 lg:w-16 flex-shrink-0" aria-hidden="true" />
                    </>
                  ) : (
                    <span>Reel</span>
                  )}
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
      <LightboxVideo open={reelOpen} onClose={() => setReelOpen(false)} src={reelSrc} title={PRIVATE_REEL.title} />
    </>
  )
}

